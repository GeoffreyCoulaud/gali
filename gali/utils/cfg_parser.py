from typing import Union, Any


class CfgParser():
    """Parser for .cfg format

    This is different from ConfigParser :
    - there are no sections
    - values are strings, quoted or not by double quotes"""

    keyvals: dict = dict()

    def read(self, filenames: Union[str, list[str]]):
        """Feed files content to the parser"""

        if isinstance(filenames, str):
            filenames = [filenames]
        for path in filenames:
            file = open(path, "r", encoding="utf-8-sig")
            lines = file.readlines()
            file.close()
            for line in lines:

                # Get key and value
                parts = line.split("=")
                parts = list(map(lambda s: s.strip(), parts))
                key = parts[0]
                value = "=".join(parts[1:])

                # If key is quoted, remove quotes
                # ? If there's a native parser, use it.
                if value.startswith("\"") and value.endswith("\""):
                    value = value[1:-1]

                self.keyvals[key] = value

    def get(self, key: str, default: Any = None) -> Any:
        """Get a key's content from the cfg data"""
        return self.keyvals.get(key, default)
