from gi.repository import GObject
from os import setsid, getpgid, killpg
from signal import SIGTERM, SIGKILL
from subprocess import Popen, TimeoutExpired

from gali.games.game import Game


class GameRunningError(Exception):
    """Error raised when trying to change the launcher's game while it is running"""
    pass


class GameNotSetError(Exception):
    """Error raised when trying to start the launcher when no game is set"""
    pass


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
        command = self.game.get_start_command()
        # ! Command executed in a shell : possible injection
        # TODO limit the impact of the shell=True command.
        self.process = Popen(args=command, preexec_fn=setsid, shell=True)

    def _send_subprocess_signal(self, signal: int, **kwargs) -> int|None:
        """Send signal to subprocess
        * Returns the process exit code if available, else None"""
        if not self.is_running():
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

    @GObject.Signal(name="terminated")
    def terminated_signal(self):
        pass

    def loop_finish_signal(self):
        """Loop waiting for the process to terminate to emit a signal.
        PROCESS_WAIT_TIMEOUT_SECONDS is set to 1 by default."""
        # TODO check that this happens correctly
        try:
            self.process.wait(timeout=self.PROCESS_WAIT_TIMEOUT_SECONDS)
        except TimeoutExpired:
            self.loop_finish_signal()
        else:
            self.emit("terminated")