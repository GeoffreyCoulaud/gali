from gali.games.game import Game


class GameRunningError(Exception):
    """Error raised when trying to change the launcher's game while it is running"""
    pass


class GameNotSetError(Exception):
    """Error raised when trying to start the launcher when no game is set"""
    pass


class Launcher():
    """Singleton class representing a game launcher.
    
    Handles starting, stopping or killing a game."""

    game: Game|None = None
    subprocess = None # TODO better define launcher subprocess
    
    def is_running(self) -> bool:
        """Get the game running status"""
        if self.game is None: 
            return False
        # TODO Return the games' status
        return False

    def set_game(self, game: Game):
        """Set the game for the launcher.
        
        Will raise an error if the current game is running."""
        if self.is_running():
            raise GameRunningError()
        self.game = game
    
    def start(self, **kwargs):
        """Start the set game in a subprocess"""
        if self.game is None: 
            raise GameNotSetError()
        # TODO start game
        pass

    def stop(self, **kwargs):
        """Stop the running game"""
        if not self.is_running():
            return
        # TODO stop game
        pass

    def kill(self, **kwargs):
        """Force kill the running game"""
        if not self.is_running():
            return
        # TODO Force kill game
        pass