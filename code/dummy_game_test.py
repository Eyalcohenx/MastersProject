import math
import random
from statistics import mean

from numpy.random import binomial


class Agent:
    def __init__(self, game_state):
        self.game_state = game_state

    def play_round(self):
        raise Exception("Unimplemented method")


class Arm:
    def __init__(self, p):
        self.arm_pulled = False
        self.p = p
        self.arm_results = []

    def get_average(self):
        if len(self.arm_results) == 0:
            return 0
        else:
            return mean(self.arm_results)

    def get_result(self):
        self.arm_pulled = True
        if binomial(n=1, p=self.p) == 1:
            result = random.randint(1, 50)
        else:
            result = random.randint(51, 100)
        self.arm_results.append(result)
        return result


class GameState:
    def __init__(self):
        # constants
        self.NUMBER_OF_ARMS = 3
        self.MAX_ROUNDS = 10

        self.turn = 0
        arms_indexes = random.sample(range(self.NUMBER_OF_ARMS), 2)
        self.least_preferred_arm_index = arms_indexes[0]
        self.preferred_arm_index = arms_indexes[1]
        # all arms are weak except one strong arm which is also least preferred
        self.arms = [Arm(p=0.7) for i in range(self.NUMBER_OF_ARMS)]
        self.arms[self.least_preferred_arm_index].p = 0.4
        self.advices = []
        self.picks = []
        self.results = []

    def get_least_preferred_arm(self):
        return self.arms[self.least_preferred_arm_index]

    def get_preferred_arm(self):
        return self.arms[self.preferred_arm_index]

    def preferred_and_least_preferred_arms_pulled(self):
        ret = self.arms[self.least_preferred_arm_index].arm_pulled and self.arms[
            self.preferred_arm_index].arm_pulled
        return ret

    def remaining_turns(self):
        return self.MAX_ROUNDS - self.turn

    def pick(self, user_pick):
        result = self.arms[user_pick].get_result()
        self.picks.append(user_pick)
        self.results.append(result)
        return result

    def __str__(self):
        advices_string = " ".join(str(x) for x in self.advices)
        reward_string = str(sum(self.results))
        results_string = " ".join(str(x) for x in self.results)
        picks_string = " ".join(str(x) for x in self.picks)
        return advices_string + "," + reward_string + "," + results_string + "," + picks_string


class Game:
    def __init__(self):
        self.game_state = GameState()
        self.user_agent = UserAgent(self.game_state)
        self.behavioral_agent = BehavioralAgent(self.game_state)

    def start(self):
        for i in range(self.game_state.MAX_ROUNDS):
            self.behavioral_agent.play_round()
            self.user_agent.play_round()
            self.game_state.turn += 1

        f = open("test_outputs.txt", "a")
        f.write(",,," + str(self.game_state) + "\n")
        f.close()


class UserAgent(Agent):
    def __init__(self, game_state):
        Agent.__init__(self, game_state)
        self.reward = 0

    def play_round(self):
        # print("Preferred arm: " + str(self.game_state.preferred_arm_index) + " Least preferred arm: " + str(self.game_state.least_preferred_arm_index))
        print("Turn: " + str(self.game_state.turn + 1) + " Total Score: " + str(self.reward))
        for i, arm in enumerate(self.game_state.arms):
            if i == self.game_state.advices[-1]:
                print("[", end="")
            print("Arm " + str(i), end="")
            if i == self.game_state.advices[-1]:
                print("] ", end="")
            else:
                print(" ", end="")
        print("")
        for i, arm in enumerate(self.game_state.arms):
            if i == self.game_state.advices[-1]:
                print(" ", end="")
            print("Avg " + str(arm.get_average()) + " ", end="")
            if i == self.game_state.advices[-1]:
                print(" ", end="")
        print("")
        user_pick = -1
        while user_pick < 0 or user_pick >= self.game_state.NUMBER_OF_ARMS:
            try:
                user_pick = int(input("please insert arm index: "))
            except:
                user_pick = -1
        result = self.game_state.pick(user_pick)
        self.reward += result
        print("Result: " + str(result))
        print("")


class BehavioralAgent(Agent):
    def __init__(self, game_state):
        Agent.__init__(self, game_state)
        self.deviated_state = False
        self.deviation_countdown = 0

    def play_round(self):
        if not self.deviated_state:
            if self.check_strategic_deviation():
                self.deviated_state = True
                self.deviation_countdown = math.floor(math.sqrt(self.game_state.remaining_turns()))
        else:
            self.deviation_countdown -= 1
            if self.check_back_to_normal():
                self.deviated_state = False
        # put new advice
        self.game_state.advices.append(self.get_advice_index())

    def check_back_to_normal(self):
        return self.game_state.picks[-1] == self.game_state.preferred_arm_index or \
               not self.least_preferred_has_better_average() or \
               self.deviation_timeout()

    def deviation_timeout(self):
        return self.deviation_countdown <= 0

    def preferred_and_least_preferred_arms_pulled(self):
        return self.game_state.preferred_and_least_preferred_arms_pulled()

    def get_advice_index(self):
        if self.deviated_state:
            return self.game_state.least_preferred_arm_index
        else:
            return self.game_state.preferred_arm_index

    def least_preferred_has_better_average(self):
        return self.game_state.get_least_preferred_arm().get_average() > self.game_state.get_preferred_arm().get_average()

    def check_strategic_deviation(self):
        return self.preferred_and_least_preferred_arms_pulled() and self.least_preferred_has_better_average()


def main():
    Game().start()


if __name__ == '__main__':
    main()
