from typing import Any, Callable


class Criteria():

	def test(self) -> bool:
		"""Test if a value fullfils the criteria"""
		pass


class EqCriteria(Criteria):
	
	value: Any = None

	def __init__(self, value) -> None:
		super().__init__()
		self.value = value

	def test(self, value) -> bool:
		return self.value == value


class InstCriteria(Criteria):

	klass: Callable = None
	
	def __init__(self, klass) -> None:
		super().__init__()
		self.klass = klass
	
	def test(self, obj) -> bool:
		return isinstance(obj, self.klass)


class PropCriteria(Criteria):

	prop: str = None
	criteria: Criteria = None

	def __init__(self, prop, criteria) -> None:
		super().__init__()
		self.prop = prop
		self.criteria = criteria

	def test(self, mapping):
		return self.criteria.test(mapping[self.prop])


class Dependency():
	
	klass: Callable = None
	criterias: list[Criteria] = []

	def __init__(self, klass: Callable, *criterias: list[Criteria]) -> None:
		self.klass = klass
		self.criterias = criterias

	def test(self, game) -> bool:
		"""Test if a game fullfils the dependency"""
		if not isinstance(game, self.klass):
			return False
		for criteria in self.criterias:
			if not criteria.test(game):
				return False
		return True