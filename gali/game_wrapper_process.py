import sys
import pickle
from signal import signal, SIGTERM

# TODO fix starting from another entry point than main
from gali.sources.startup_chain import StartupChain

class StartupChainRunner():
    """Class in charge of running the startup chain
    * Handles SIGTERM by running cleanup before exiting"""

    startup_chain: StartupChain

    def __init__(self, startup_chain: StartupChain) -> None:
        self.startup_chain = startup_chain

    def handle_sigterm(self) -> None:
        """Handle force terminating gracefully (cleanup)"""
        self.startup_chain.cleanup()
        sys.exit(0)

    def run(self) -> None:
        """Run the startup chain"""
        signal(SIGTERM, self.handle_sigterm)
        self.startup_chain.prepare()
        self.startup_chain.start()
        self.startup_chain.cleanup()


def main():
    startup_chain: StartupChain = pickle.load(sys.stdin.buffer)
    runner = StartupChainRunner(startup_chain)
    runner.run()

if __name__ == "__main__":
    main()

