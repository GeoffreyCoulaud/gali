import re


def prepare_filename(string: str) -> str:
    """Transform a string to be a suitable file name.

    This will replace non alphanumeric characters with "-" """
    pattern = re.compile("[^a-zA-Z0-9]")
    return re.sub(pattern, "-", string)
