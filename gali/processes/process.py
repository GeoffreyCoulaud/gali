from subprocess import Popen

# TODO implement process class
class Process():
	
	process: Popen = None

	game = None
	command: str = None
	args: list[str] = []

	is_stoppable: bool = True
	is_killable: bool = True

	def __init__(self, game) -> None:
		self.game = game

	def is_running(self) -> bool:
		return self.process.poll() is not None

	def start(self) -> None:
		self.process = Popen(
			executable=self.command,
			args=self.args
		)

	def stop(self) -> None:
		if not self.is_stoppable:
			return
		self.process.terminate()

	def kill(self) -> None:
		if not self.is_killable:
			return
		self.process.kill()