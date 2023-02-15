from abc import ABC
from typing import Union, Any, Iterable


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


class ABCScannable(ABC):
    """
    Abstract class representing a scannable (eg. a Source).
    Implementations must specify the scan method.
    Implementations should specify the is_scannable method for more clarity to 
    the end user.
    """

    def scan(self) -> Iterable[Any]:
        """Start a scan, returning an iterable"""
        return list()

    def is_scannable(self) -> Union[bool, UnscannableReason]:
        """
        Check if self is scannable.
        
        Return value :
        - If scannable -> True
        - Else -> a falsy reason
        """
        return True