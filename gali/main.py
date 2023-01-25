import sys
from gali.library import Library
from gali.ui.application import GaliApplication

def main(version):
    library = Library()
    application = GaliApplication(library=library)
    return application.run(sys.argv)
