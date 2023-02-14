from dataclasses import dataclass, field

from gali.sources.base_game import BaseGame
from gali.sources.itch.itch_linux_startup_chain import ItchLinuxStartupChain
from gali.sources.itch.itch_script_startup_chain import ItchScriptStartupChain
from gali.sources.itch.itch_java_startup_chain import ItchJavaStartupChain


class UnsupportedFlavorException(Exception):
    pass


@dataclass
class ItchGame(BaseGame):

    platform: str = field(default="PC", init=False)
    caves: list = field(default=None)
    verdict: dict = field(default=None)
    game_id: str = field(default=None)
    startup_chains = list()

    # Example verdict structure
    """{
        "basePath": "/home/geoffrey/Jeux/itch/procrabstination",
        "totalSize": 193566920,
        "candidates": [
            {
                "path": "Procrabstination.x86_64",
                "depth": 1,
                "flavor": "linux",
                "arch": "amd64",
                "size": 14720
            }
        ]
    }"""

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
                # TODO implement startup chain for web games
