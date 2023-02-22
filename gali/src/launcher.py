import pickle
import inspect
import sys
from gi.repository import GObject
from os import killpg, pathsep, environ
from signal import SIGTERM, SIGKILL
from subprocess import Popen, PIPE

from gali.sources.startable import Startable
from gali.game_wrapper_process import StartupChainRunner


class GameRunningError(Exception):
    """Error raised when trying to change the launcher's game while it is running"""
    pass


class GameNotSetError(Exception):
    """Error raised when trying to start the launcher when no game is set"""
    pass


class NoStartupChainError(Exception):
    """Error raised when trying to start the launcher when the game has no startup chain"""
    pass


class GameNotRunningError(Exception):
    """Error raised when trying to send a signal when the process is not started"""
    pass


class Launcher(GObject.Object):
    """Singleton class representing a game launcher
    * Handles starting, stopping or killing a game"""

    __gtype_name__ = "GaliLauncher"

    game: Startable|None = None
    process: Popen|None = None

    def __init__(self) -> None:
        super().__init__()

    def is_running(self) -> bool:
        """Get the launcher running status"""
        if (self.game is None) or (self.process is None): return False
        return self.process.poll() is None

    def set_game(self, game: Startable):
        """Set the game for the launcher
        * Can raise GameRunningError if trying to change game when already running"""
        if self.is_running(): raise GameRunningError()
        self.game = game

    def start(self):
        """Start the set game. The resulting subprocess has its own process group.
        * Can raise GameNotSetError if no game is set
        * Can raise NoStartupChainError if game has no startup chain"""

        if self.is_running(): raise GameRunningError()
        if self.game is None: raise GameNotSetError()

        # TODO remove when choosing startup chain is implemented (sc passed as an argument)
        if len(self.game.startup_chains) == 0: raise NoStartupChainError()
        startup_chain_class = self.game.startup_chains[0]

        # TODO Remove when choosing startup chain options is implemented (options passed as an argument)
        options = dict()

        # Start game in a subprocess
        # This is important for several reasons:
        # - the UI must not hang
        # - terminating the game terminates its subprocesses
        # - exiting the launcher must not exit the game
        module = inspect.getabsfile(StartupChainRunner)
        process_args = [sys.executable, module]
        process_env = environ.copy()
        process_env["PYTHONPATH"] = pathsep.join(sys.path)
        self.process = Popen(
            args=process_args, 
            env=process_env,
            start_new_session=True,
            stdin=PIPE
        )
        
        # Pass data to subprocess
        startup_chain = startup_chain_class(game=self.game, options=options)
        pickle.dump(startup_chain, self.process.stdin)
        self.process.stdin.close()

    def terminate(self, force: bool = False) -> None:
        """Stop the running game
        * Setting force=True can incur data loss. Use at your own risk"""
        # TODO doesn't work in flatpak sandbox : Since games are run on the host and not in a sandbox, we can't send a signal to them 
        if not self.is_running(): return
        signal = SIGKILL if force else SIGTERM
        killpg(self.process.pid, signal)