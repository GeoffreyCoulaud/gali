from configparser import ConfigParser
from typing import Union


class ExplicitConfigParser(ConfigParser):
    """A class representing a ConfigParser that can fail while reading"""

    def read(
        self,
        filenames: Union[str, list[str]],
        encoding: str = "utf-8-sig"
    ) -> None:
        """
            Read and parse a filename or an iterable of filenames.
            Failing to read a file will throw an exception.
            A single filename may also be given.
            Return list of successfully read files.
        """
        if isinstance(filenames, str):
            filenames = [filenames]
        for filename in filenames:
            try:
                file = open(filename, encoding=encoding)
            except IOError as err:
                raise err
            else:
                with file:
                    self.read_file(file)
