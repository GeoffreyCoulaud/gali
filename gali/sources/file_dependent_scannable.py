from abc import abstractmethod
from os import access, R_OK, PathLike
from os.path import isfile

from gali.sources.scannable import Scannable, UnscannableReason

class FileDependentScannable(Scannable):
    """Abstract class representing a scannable that depends on a file to be
    present and readable for is_scannable to return true"""

    @abstractmethod
    def get_precondition_file_path() -> PathLike:
        pass

    def is_scannable(self):
        path = self.get_precondition_file_path()
        if (not isfile(path)) or (not access(path, R_OK)):
            return UnscannableReason(f"Precondition file is not readable : {path}")
        return True