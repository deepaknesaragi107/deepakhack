"""In-Memory Scan History Store."""
from typing import List
from app.schemas.scan import ScanResponse

class HistoryStore:
    def __init__(self, max_items: int = 100):
        self._history: List[ScanResponse] = []
        self.max_items = max_items

    def add(self, scan: ScanResponse) -> None:
        self._history.insert(0, scan)
        if len(self._history) > self.max_items:
            self._history.pop()

    def get_all(self, limit: int = 50) -> List[ScanResponse]:
        return self._history[:limit]

    def clear(self) -> None:
        self._history.clear()

history_store = HistoryStore()

