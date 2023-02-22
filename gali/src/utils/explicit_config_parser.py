from configparser import ConfigParser
from os import PathLike
from typing import Optional, Union


class ExplicitConfigParser(ConfigParser):
    """A class representing a ConfigParser that can fail while reading"""

    def read_one(self, filename: Union[PathLike, str], encoding: Optional[str] = "utf-8-sig") -> None:
        """
            Read and parse a filename or an iterable of filenames.
            Failing to read a file will throw an exception.
            A single filename may also be given.
            Return list of successfully read files.
        """
        try:
            file = open(filename, encoding=encoding)
        except IOError as err:
            raise err
        else:
            with file:
                self.read_file(file)
