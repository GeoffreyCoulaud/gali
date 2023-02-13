from gali.sources.startup_chain import StartupChain


class ItchStartupChain(StartupChain):
    """An abstract Itch startup chain
    
    From http://docs.itch.ovh/butlerd/master/#/?id=verdict-struct

    A Verdict contains a wealth of information on how to “launch” or “open”
    a specific folder.

    From http://docs.itch.ovh/butlerd/master/#/?id=candidate-struct

    A Candidate is a potentially interesting launch target, be it a native
    executable, a Java or Love2D bundle, an HTML index, etc.
    """

    # TODO define the common parts for itch startup chains and group them here

    # Build start command
    # base_path = self.verdict["basePath"]
    # exec_path = candidate["path"]
    # path = f"{base_path}/{exec_path}"
    # flavor = candidate["flavor"]