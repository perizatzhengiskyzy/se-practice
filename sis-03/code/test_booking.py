import unittest
from booking import can_book

class TestBooking(unittest.TestCase):
    def setUp(self):
        self.now = 540
        self.existing = [(600, 660)]

    def test_T1_touching(self):
        self.assertTrue(can_book(660, 720, self.now, False, self.existing))

    def test_T2_overlap(self):
        self.assertFalse(can_book(630, 690, self.now, False, self.existing))

    def test_T3_blocked(self):
        self.assertFalse(can_book(660, 720, self.now, True, self.existing))

    def test_T4_exactly_120(self):
        self.assertTrue(can_book(720, 840, self.now, False, self.existing))

    def test_T5_over_120(self):
        self.assertFalse(can_book(720, 841, self.now, False, self.existing))

    def test_T6_starts_now(self):
        self.assertFalse(can_book(540, 570, self.now, False, self.existing))

    def test_T7_reversed(self):
        self.assertFalse(can_book(720, 660, self.now, False, self.existing))

    def test_T8_ends_at_midnight(self):
        self.assertTrue(can_book(1380, 1440, self.now, False, self.existing))

    def test_T9_past_midnight(self):
        self.assertFalse(can_book(1380, 1441, self.now, False, self.existing))

    def test_T10_second_booking(self):
        existing_two = [(600, 660), (700, 760)]
        self.assertFalse(can_book(720, 780, self.now, False, existing_two))

    def test_T11_same_check_twice(self):
        r1 = can_book(660, 720, self.now, False, self.existing)
        r2 = can_book(660, 720, self.now, False, self.existing)
        self.assertTrue(r1 and r2)

    def test_T12_zero_start(self):
        self.assertTrue(can_book(0, 60, -1, False, []))

if __name__ == '__main__':
    unittest.main()