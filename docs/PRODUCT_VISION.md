# Cognitive Game for Medical Students — Product Context

## 1. Product Vision

A scientifically engineered mobile cognitive game designed around the cognitive demands of medical education, **without using medical content**.

The game should feel like an IQ test wearing a polished game skin: highly engaging on the surface, but underneath it functions as an adaptive cognitive assessment and training system.

The core principle:

> **Train and measure transferable cognitive abilities that are relevant to demanding academic learning, especially the cognitive demands experienced by medical students.**

The product should not claim to increase IQ or improve medical performance unless those claims are later supported by appropriate research.

---

## 2. Target User

### Primary audience

Medical students, particularly students in demanding undergraduate medical programs.

### Secondary audience

Students and intellectually curious users who want rigorous cognitive challenges.

The medical-student optimization should happen through **task selection, difficulty design, cognitive profiling, and training strategy**, not through medical questions.

---

## 3. Core Cognitive Domains

The game should measure and train:

| Domain | What it represents | Example game mechanic |
|---|---|---|
| Fluid reasoning | Solving novel problems | Abstract patterns, matrices, rule discovery |
| Working memory | Holding/manipulating information | Sequences, dual-task challenges |
| Processing speed | Rapid accurate decisions | Timed discrimination |
| Visual-spatial reasoning | Mental manipulation of objects | Rotation, spatial transformations |
| Cognitive flexibility | Switching between rules | Dynamic rule-switching |
| Selective attention | Filtering relevant information | Distractor-heavy tasks |
| Inhibitory control | Suppressing automatic responses | Go/no-go and interference tasks |
| Quantitative reasoning | Understanding numerical relationships | Number patterns and transformations |
| Pattern recognition | Detecting structure | Visual, numerical and symbolic patterns |

---

## 4. Product Architecture

The product has three major layers.

### Layer A — Game Layer

What the player experiences.

It should contain:

- Worlds/environments
- Missions
- Challenges
- Progression
- XP
- Streaks
- Unlocks
- Daily challenges
- Boss challenges
- Optional leaderboards
- Visual feedback
- Sound and haptics

The player should feel like they are playing a game rather than completing a psychological assessment.

### Layer B — Cognitive Engine

The engine determines:

- Which cognitive domain is being tested
- Task type
- Difficulty
- Cognitive load
- Time pressure
- Distractor level
- Memory requirements
- Rule complexity
- Novelty
- Combination of domains

### Layer C — Psychometric Engine

The psychometric system tracks:

- Accuracy
- Response time
- Difficulty reached
- Error patterns
- Consistency
- Performance under time pressure
- Performance under cognitive load
- Item characteristics
- Estimated ability
- Reliability/confidence of estimates

---

## 5. Game Modes

### Assessment Mode

A controlled cognitive assessment.

Characteristics:

- No hints
- No retries
- No power-ups
- Controlled timing
- Carefully selected items
- Adaptive difficulty
- Limited session length

Purpose:

> Estimate cognitive abilities as accurately as possible.

The assessment should initially produce **ability estimates or percentiles**, not an unvalidated "IQ score."

### Training Mode

A repeatable game experience.

Features:

- XP
- Levels
- Streaks
- Challenges
- Boss encounters
- Difficulty progression
- Personalized weaknesses
- Daily sessions
- Long-term progression

Purpose:

> Repeatedly challenge selected cognitive abilities while maintaining engagement.

### Retest Mode

Periodically reassess the player using appropriately controlled items.

Purpose:

> Determine whether performance has changed rather than simply rewarding familiarity with the training tasks.

---

## 6. Adaptive Difficulty

The game should not use a simple fixed progression such as:

`Level 1 → Level 2 → Level 3 → Level 4`

Instead, each player has a continuously updated estimated ability.

For example:

```text
Current estimated ability: 63.4
        ↓
Generate candidate items
        ↓
Select items near the player's estimated ability
        ↓
Observe response
        ↓
Update ability estimate
        ↓
Generate next challenge
```

A strong player should encounter increasingly difficult problems without reaching a conventional maximum level.

---

## 7. Infinite Procedural Levels

The game should generate challenges algorithmically instead of storing every level manually.

### Example generator parameters

```text
Task type
Difficulty
Sequence length
Number range
Number of rules
Transformation type
Distractor count
Time limit
Memory load
Spatial complexity
Rule-switch frequency
```

A generator can combine these parameters to create large numbers of unique challenges.

### Example

A basic pattern:

```text
2 → 4 → 8 → 16 → ?
```

A more complex challenge could involve:

- Two simultaneous sequences
- Alternating rules
- Irregular transformations
- A memory requirement
- Distractors
- Time pressure

The player should effectively have no fixed end point.

---

## 8. Procedural Generation Safety

Infinite generation must not mean uncontrolled randomness.

Every generated item should pass validation.

### Generation pipeline

```text
GENERATE
   ↓
SOLVE
   ↓
VERIFY UNIQUE INTENDED ANSWER
   ↓
CHECK AMBIGUITY
   ↓
ESTIMATE DIFFICULTY
   ↓
CHECK COGNITIVE DOMAIN
   ↓
CHECK DUPLICATION/SIMILARITY
   ↓
PLAYER-SPECIFIC SELECTION
   ↓
DELIVER
```

The system should reject items that are:

- Ambiguous
- Impossible
- Trivially predictable
- Too similar to recent items
- Invalid
- Multi-answer without intentional design
- Poorly calibrated
- Outside the intended difficulty range

---

## 9. Psychometric Foundation

For a scientifically serious product, difficulty should not simply be a developer-assigned number.

The long-term system should investigate psychometric models such as:

- Item Response Theory (IRT)
- Computerized Adaptive Testing (CAT)
- Classical Test Theory
- Reliability analysis
- Item discrimination
- Response-time analysis
- Norm-referenced scoring

Each item can eventually have parameters such as:

```text
Difficulty
Discrimination
Guessing probability
Domain
Subdomain
Response-time distribution
```

The adaptive engine can use these parameters to select informative items.

---

## 10. Medical-Student Optimization Without Medical Content

The game should prioritize cognitive abilities that are plausibly relevant to demanding medical education.

### High-priority domains

1. Working memory
2. Fluid reasoning
3. Visual-spatial reasoning
4. Selective attention
5. Processing speed
6. Cognitive flexibility
7. Pattern recognition
8. Quantitative reasoning
9. Inhibitory control

### Example: Interference Training

A challenge might contain several simultaneous pieces of information:

```text
17

2 + 3 = ?

▲ ● ▲ ●

91

BLUE
```

Only one component is relevant to the current instruction.

As difficulty increases:

- Distractors become more similar to the target
- Distractor count increases
- Rules change more frequently
- Time pressure increases
- Working-memory demands increase

This creates a more demanding cognitive environment without requiring any medical knowledge.

---

## 11. Multi-Domain Challenges

The most advanced challenges should combine cognitive domains.

Example:

```text
1. Memorize a sequence.
2. Mentally rotate several shapes.
3. Apply a changing rule.
4. Ignore irrelevant symbols.
5. Select the correct result under time pressure.
```

This can simultaneously stress:

- Working memory
- Spatial reasoning
- Cognitive flexibility
- Selective attention
- Processing speed

The engine should know which components are being stressed.

---

## 12. Cognitive Profile

Instead of reducing the player to one number, the game should produce a profile.

Example:

```text
MIND PROFILE

Fluid Reasoning       87th percentile
Working Memory        94th percentile
Spatial Reasoning     91st percentile
Processing Speed      71st percentile
Cognitive Flexibility 88th percentile
Selective Attention   76th percentile
```

The profile should also show:

- Confidence/reliability
- Recent performance
- Long-term trend
- Relative strengths
- Relative weaknesses

Do not present these as clinically or psychometrically validated measurements until appropriate validation has been completed.

---

## 13. Personalized Training

The game should allocate training based on the player's profile.

Example:

```text
Working Memory
Current estimate: Strong
Training allocation: Moderate

Processing Speed
Current estimate: Average
Training allocation: High

Spatial Reasoning
Current estimate: Very Strong
Training allocation: Moderate
```

The system should avoid wasting the majority of a player's training time on abilities they already perform extremely well in.

---

## 14. Difficulty Should Be Multi-Dimensional

Difficulty should not simply mean "harder questions."

A challenge can become harder through:

- More information
- More rules
- Less obvious relationships
- More distractors
- Longer sequences
- Greater memory load
- More transformations
- Faster time limits
- More frequent rule changes
- Combined cognitive demands

Therefore the difficulty model should be represented as a vector rather than one crude number.

Example:

```text
Difficulty Vector

Reasoning:       0.72
Memory:          0.58
Spatial:         0.81
Speed:           0.63
Attention:       0.77
Flexibility:     0.45
```

---

## 15. Game Progression

A possible progression structure:

### Stage 1 — Calibration

Learn the player's approximate abilities.

### Stage 2 — Foundation

Introduce individual cognitive domains.

### Stage 3 — Intensification

Increase difficulty within individual domains.

### Stage 4 — Integration

Combine multiple cognitive demands.

### Stage 5 — Adaptive Mastery

Generate challenges specifically around the player's current ability boundaries.

### Stage 6 — Endless Mode

No predefined maximum level.

The system continually searches for the player's cognitive ceiling.

---

## 16. What Makes It Different

The product should avoid becoming:

- A collection of generic brain games
- A trivia app
- A medical quiz app
- A simple IQ-test clone
- A game with arbitrary difficulty
- A question bank with thousands of manually written questions

Instead:

> **It is a procedural cognitive assessment and training system presented as a game.**

---

## 17. Scientific Integrity

The product should distinguish between:

### What can be claimed initially

- The game measures performance on selected cognitive tasks.
- The game can create an individualized cognitive-performance profile.
- The game can adapt difficulty based on observed performance.
- The game can train performance on the tasks it contains.

### What requires research

- Increasing general intelligence
- Increasing IQ
- Improving medical school performance
- Improving clinical reasoning
- Transfer to unrelated real-world cognitive abilities

If the product eventually makes stronger claims, those claims should be supported by appropriate empirical research.

---

## 18. Suggested MVP

The first version should NOT attempt to build every cognitive domain.

Start with 4:

### 1. Fluid Reasoning

Pattern and rule-discovery challenges.

### 2. Working Memory

Sequence storage/manipulation.

### 3. Spatial Reasoning

Mental rotation and spatial transformations.

### 4. Processing Speed

Rapid discrimination and decision-making.

Build:

- Procedural generation
- Adaptive difficulty
- Basic player profile
- Training mode
- Assessment mode
- Response-time tracking
- Difficulty estimation
- Local progression

Then expand.

---

## 19. Suggested Technical Direction

A practical mobile architecture:

### Game engine

**Godot** or **Unity**

### Backend

**Supabase**

Potential backend responsibilities:

- Authentication
- Player profiles
- Progression
- Assessment history
- Item metadata
- Leaderboards
- Analytics

### Cognitive engine

Can initially run locally where possible.

Use server-side processing for:

- Model updates
- Analytics
- Calibration
- Global item statistics
- Experimental psychometric models

### AI

AI should not be responsible for blindly generating assessment questions.

A safer architecture is:

```text
Deterministic Generator
        +
Mathematical Validator
        +
Psychometric Metadata
        +
Optional AI-assisted Variation
```

AI can help create novel variations, but deterministic validation should decide whether an item is actually valid.

---

## 20. Long-Term Vision

The ultimate product is:

> **An adaptive cognitive game that can continuously generate novel challenges, estimate a player's cognitive profile, personalize training, and eventually support scientifically validated measurement.**

The player experiences:

**Game → Challenge → Progress → Mastery**

The system experiences:

**Stimulus → Response → Measurement → Estimation → Adaptation**

That separation is the foundation of the product.
