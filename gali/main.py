import sys
from os import environ
from tempfile import mkstemp

from gali.ui.application import Application
from gali.utils.sandbox import in_flatpak_sandbox

# Set up the singletons
import gali.singletons as singletons

def main(version):

    # In flatpak, set the TMPDIR in $XDG_RUNTIME_DIR/app/$FLATPAK_ID
    # see https://docs.flatpak.org/en/latest/sandbox-permissions.html?highlight=XDG_RUNTIME_DIR#filesystem-access
    if in_flatpak_sandbox():
        # TODO Are these env vars guaranteed to be set ?
        XDG_RUNTIME_DIR = environ.get("XDG_RUNTIME_DIR")
        FLATPAK_ID = environ.get("FLATPAK_ID")
        environ["TMPDIR"] = f"{XDG_RUNTIME_DIR}/app/{FLATPAK_ID}"

    # Create and run app
    application = Application()
    return application.run(sys.argv)
