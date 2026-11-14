"""In-Memory Sliding Window Rate Limiter Module."""
import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from app.core.config import settings

class RateLimiter:
    def __init__(self, requests_per_minute: int = settings.RATE_LIMIT_PER_MINUTE):
        self.requests_per_minute = requests_per_minute
        self.window_seconds = 60
        self.client_records = defaultdict(list)

    def is_allowed(self, client_ip: str) -> tuple[bool, int]:
        now = time.time()
        cutoff = now - self.window_seconds
        
        # Purge timestamps older than the 60s sliding window
        self.client_records[client_ip] = [
            ts for ts in self.client_records[client_ip] if ts > cutoff
        ]
        
        current_count = len(self.client_records[client_ip])
        if current_count >= self.requests_per_minute:
            oldest = self.client_records[client_ip][0]
            retry_after = int(self.window_seconds - (now - oldest)) + 1
            return False, max(1, retry_after)
            
        self.client_records[client_ip].append(now)
        return True, 0

limiter = RateLimiter()

async def rate_limit_dependency(request: Request):
    """FastAPI dependency to rate limit incoming requests per client IP."""
    client_ip = request.client.host if request.client else "unknown_client"
    allowed, retry_after = limiter.is_allowed(client_ip)
    
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Rate limit exceeded",
                "message": f"Too many requests. Please wait {retry_after} seconds before retrying.",
                "retry_after_seconds": retry_after
            },
            headers={"Retry-After": str(retry_after)}
        )

