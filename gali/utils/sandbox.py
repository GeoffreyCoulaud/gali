from typing import Union
import os

def get_flatpak_id() -> Union[str, None]:
    """Get the Flatpak sandbox app id, None if not inside one."""
    return os.environ.get("FLATPAK_ID", default=None)

def is_flatpak() -> bool:
    """Detect if the app is running inside a Flatpak sandbox.

    This relies on the environment variable FLATPAK_ID to be set.

    Docs : https://docs.flatpak.org/en/latest/flatpak-command-reference.html#flatpak-run"""
    return get_flatpak_id() is not None
