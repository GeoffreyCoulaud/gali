import sys
from gali.ui.application import Application

# Set up the singletons
import gali.singletons as singletons

def main(version):
    application = Application()
    return application.run(sys.argv)
