from gali.sources.startable import Startable
from gali.sources.itch.abc_itch_game import ABCItchGame
from gali.sources.itch.native.itch_linux_startup_chain import ItchLinuxStartupChain
from gali.sources.itch.native.itch_script_startup_chain import ItchScriptStartupChain
from gali.sources.itch.native.itch_java_startup_chain import ItchJavaStartupChain


class ItchNativeGame(ABCItchGame, Startable):

    startup_chains = list()

    def __post_init__(self) -> None:
        """Determine the appropriate command chains"""
        for candidate in self.verdict["candidates"]:
            match candidate:
                case "linux": 
                    self.startup_chains.append(ItchLinuxStartupChain)
                case "script":
                    self.startup_chains.append(ItchScriptStartupChain)
                case "java":
                    self.startup_chains.append(ItchJavaStartupChain)
                # TODO implement startup chain for other candidate types
