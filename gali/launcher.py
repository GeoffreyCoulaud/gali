import logging
from shutil import which
from gi.repository import GObject
from os import setsid, getpgid, killpg
from signal import SIGTERM, SIGKILL
from subprocess import Popen, TimeoutExpired

from gali.sources.game import Game
from gali.utils.sandbox import is_flatpak

class GameRunningError(Exception):
    """Error raised when trying to change the launcher's game while it is running"""
    pass


class GameNotSetError(Exception):
    """Error raised when trying to start the launcher when no game is set"""
    pass


# TODO edit to accomodate the StartupChain model
# (use multiprocessing, pool of size 1, stop and kill sent directly to it)

class Launcher(GObject.Object):
    """Singleton class representing a game launcher
    * Handles starting, stopping or killing a game"""

    __gtype_name__ = "GaliLauncher"

    game: Game|None = None
    process: Popen|None = None
    PROCESS_WAIT_TIMEOUT_SECONDS = 1

    def is_running(self) -> bool:
        """Get the game running status"""
        if self.game is None: 
            return False
        if self.process is None:
            return False
        exit_code = self.process.poll()
        return (exit_code is None)

    def set_game(self, game: Game):
        """Set the game for the launcher
        * Can raise GameRuningError if the current game is running"""
        if self.is_running():
            raise GameRunningError()
        self.game = game
    
    def start(self, **kwargs):
        """Start the set game. The resulting subprocess has its own process group.
        * Can raise GameNotSetError if no game is set
        * Can raise OSError if the subprocess cannot be created
        * Can raise ValueError if the arguments are invalid"""
        
        if self.game is None: 
            raise GameNotSetError()
        
        # Build command arguments
        args = list()
        if is_flatpak(): args.extend(["flatpak-spawn", "--host"])
        args.extend(self.game.get_start_command())
        
        # Resolve command path
        args[0] = which(args[0])

        print(f"Starting \"{self.game.name}\"")
        print(args)
        self.process = Popen(args=args, preexec_fn=setsid)

    def _send_subprocess_signal(self, signal: int, **kwargs) -> int|None:
        """Send signal to subprocess
        * Returns the process exit code if available, else None"""
        if not self.is_running():
            logging.warning(f"Cannot send signal {signal} to subprocess")
            return None
        pgid = getpgid(self.process.pid)
        killpg(pgid, signal)
        return self.process.poll()

    def stop(self, **kwargs) -> int|None:
        """Stop the running game
        * Returns the process exit code if successful, else None"""
        self._send_subprocess_signal(SIGTERM)

    def kill(self, **kwargs):
        """Force kill the running game. Data loss can occur, please prefer the stop method.
        * Returns the process exit code"""
        self._send_subprocess_signal(SIGKILL)