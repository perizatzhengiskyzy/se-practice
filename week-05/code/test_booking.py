
import unittest
from booking import can_book


class BookingTests(unittest.TestCase):

    def test_touching_end_is_allowed(self):
        self.assertIs(
            can_book(660, 720, 540, False, [(600, 660)]), True
        )

    def test_exactly_two_hours(self):
        self.assertIs(
            can_book(720, 840, 540, False, [(600, 660)]), True
        )

    def test_over_two_hours(self):
        self.assertIs(
            can_book(720, 841, 540, False, [(600, 660)]), False
        )

    def test_blocked_room(self):
        self.assertIs(
            can_book(660, 720, 540, True, [(600, 660)]), False
        )

    def test_starts_now(self):
        self.assertIs(
            can_book(540, 570, 540, False, [(600, 660)]), False
        )

    def test_starts_before_now(self):
        self.assertIs(
            can_book(539, 570, 540, False, [(600, 660)]), False
        )

    def test_starts_one_minute_after_now(self):
        self.assertIs(
            can_book(541, 570, 540, False, [(600, 660)]), True
        )

    def test_zero_duration(self):
        self.assertIs(
            can_book(720, 720, 540, False, [(600, 660)]), False
        )

    def test_reversed_times(self):
        self.assertIs(
            can_book(800, 700, 540, False, [(600, 660)]), False
        )

    def test_end_after_day_limit(self):
        self.assertIs(
            can_book(1400, 1441, 540, False, []), False
        )

    def test_end_at_day_limit(self):
        self.assertIs(
            can_book(1400, 1440, 540, False, []), True
        )

    def test_overlap(self):
        self.assertIs(
            can_book(630, 690, 540, False, [(600, 660)]), False
        )

    def test_touching_start_is_allowed(self):
        self.assertIs(
            can_book(570, 600, 540, False, [(600, 660)]), True
        )

    def test_overlap_from_left(self):
        self.assertIs(
            can_book(570, 630, 540, False, [(600, 660)]), False
        )

    def test_booking_inside_existing(self):
        self.assertIs(
            can_book(610, 650, 540, False, [(600, 660)]), False
        )

    def test_booking_contains_existing(self):
        self.assertIs(
            can_book(570, 690, 540, False, [(600, 660)]), False
        )

    def test_same_interval(self):
        self.assertIs(
            can_book(600, 660, 540, False, [(600, 660)]), False
        )

    def test_empty_existing(self):
        self.assertIs(
            can_book(700, 760, 540, False, []), True
        )

    def test_multiple_existing(self):
        existing = [(600, 660), (750, 810)]
        self.assertIs(
            can_book(770, 790, 540, False, existing), False
        )

    def test_existing_unchanged(self):
        existing = [(600, 660), (750, 810)]
        original = existing.copy()

        can_book(770, 790, 540, False, existing)

        self.assertEqual(existing, original)


    def test_success_does_not_add_booking(self):
        existing = []
        original = existing.copy()

        result = can_book(700, 760, 540, False, existing)

        self.assertIs(result, True)
        self.assertEqual(existing, original)

    def test_unsorted_existing_unchanged(self):
        existing = [(900, 960), (600, 660)]
        original = existing.copy()

        result = can_book(700, 760, 540, False, existing)

        self.assertIs(result, True)
        self.assertEqual(existing, original)

    def test_blocked_does_not_modify_existing(self):
        existing = [(900, 960), (600, 660)]
        original = existing.copy()

        result = can_book(700, 760, 540, True, existing)

        self.assertIs(result, False)
        self.assertEqual(existing, original)
