from gali.processes.process import Process

class CitraProcess(Process):

	command = "citra-qt"

	def __init__(self, game) -> None:
		super().__init__(game)
		self.args.append(self.game.game_path)