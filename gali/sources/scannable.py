from abc import ABC, abstractmethod
from typing import Union


class UnscannableReason():
    """
    Semantic reason for a Scannable to not be scannable.
    Every instance is falsy.
    """

    message: str

    def __init__(self, message: str):
        self.message = message

    def __str__(self) -> str:
        return self.message

    def __bool__(self) -> bool:
        return False


class Scannable(ABC):
    """
    Abstract class representing a scannable (eg. a Source).
    Implementations must specify the scan method.
    Implementations should specify the is_scannable method for more clarity to 
    the end user.
    """

    @abstractmethod
    def scan(self) -> tuple[object]:
        """Start a scan, returning a tuple of objects"""

    def is_scannable(self) -> Union[bool, UnscannableReason]:
        """
        Check if self is scannable.
        
        Return value :
        - If scannable -> True
        - Else -> a falsy reason
        """
        return True