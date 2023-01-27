import sys
from gali.ui.application import GaliApplication

# Set up the singletons
import gali.singletons as singletons

def main(version):
    application = GaliApplication()
    return application.run(sys.argv)
