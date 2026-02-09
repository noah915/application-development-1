1. The original bug was a ReferenceError because `discount` was used without being defined. Node threw the error when it hit `return total - discount;` in `applyDiscount`, so execution stopped immediately.
2. Logging made the flow visible: I could see the inputs, the computed total, whether the discount rule triggered, and the final value, which made it easy to confirm the logic.
3. Testing is better than manually re-running the script because it’s repeatable, fast, and checks multiple scenarios automatically without human error.
4. If I could keep only one test, I’d keep the discount-applied test because it exercises the main business rule (the discount threshold) and verifies the most important behavior.
