# Executive Plan

## Project Direction

CN Failure Atlas should be repositioned as a **structured failure atlas and casebook for fictional dialogue models**, with a **benchmark-compatible pilot subset** retained as formal scaffolding.

This is not a retreat from rigor. It is a clearer fit for the actual problem the project is trying to surface.

The repo's distinctive value is not only that it can collect evaluation cases. Its stronger contribution is that it can name, organize, and demonstrate forms of failure that experienced fictional-dialogue users often feel immediately but public evaluation rarely describes well.

## Why This Pivot Makes Sense

A benchmark-first framing works well for failure modes that are relatively easy to specify and compare:

- emotion misread
- subtext blindness
- motivation misread
- obvious OOC modernization
- therapist-mode intrusion
- lore violation

However, many of the failures that matter most to experienced users are harder to reduce to simple scoring without losing what makes them important. These include:

- symmetry bias
- overcoherent characterization
- desire over-legibility
- self-protective friction loss
- narrative template intrusion
- cinematic time dilation
- dialogue overfunctionalization
- consequence avoidance

These failures are often not sentence-level mistakes. They are structural distortions. They make text feel polished yet false.

An atlas / casebook framing lets the project describe these failures precisely without pretending all of them are already fully benchmark-stable.

## Strategic Identity

The repo should now have three nested layers.

### 1. Failure Atlas

The primary layer.

It should define and distinguish the major failure families and explain:

- what each one is
- why users react strongly to it
- what the model appears to be optimizing for when it produces it
- which scenes tend to trigger it
- how it differs from nearby failures

### 2. Casebook

The demonstrative layer.

It should show:

- scene setup
- common bad output patterns
- why those outputs fail
- where the reader starts to feel the scene turn false
- a better version
- why the better version works

### 3. Benchmark-Compatible Pilot Subset

The formal layer.

It should retain:

- structured YAML case schema
- Task A / Task B framing
- light rubric support
- a small pilot case set
- prompt templates
- self-evaluation and optional baseline samples

This layer should remain, but it should no longer dominate the repo's identity.

## Classification Backbone

The failure atlas should be organized into five top-level families.

### I. Scene Reading Failures

Failures where the model misreads what the scene means.

Examples:
- emotion_misread
- subtext_blindness
- motivation_misread
- relationship_logic_error
- worldview_constraint_error
- ambiguity_collapse

### II. Relational Distortion Failures

Failures where the model rewrites the relationship into a smoother, more balanced, or more consumable version.

Examples:
- relationship_flattening
- symmetry_bias
- supportive_but_wrong
- reader_comfort_alignment
- specialness_dilution

### III. Character Psychology Failures

Failures where the model turns people into overly coherent, legible, and manageable psychological objects.

Examples:
- overcoherent_characterization
- desire_overlegibility
- premature_affective_closure
- self_protective_friction_loss
- impulse_recontainment
- affect_manageability_bias

### IV. Narrative / Temporal Distortion Failures

Failures where the model produces a polished narrative artifact instead of a believable scene occurrence.

Examples:
- narrative_template_intrusion
- predictable_rhythm_exposure
- cinematic_time_dilation
- scene_pacing_distortion
- rhythm_homogenization
- descriptive_substitution_for_experience
- microreaction_oversegmentation
- over_stylized_line_breaking
- aesthetic_obedience_bias
- texture_substituting_for_substance
- dialogue_overfunctionalization
- pov_buoyancy

### V. Weight / Consequence Failures

Failures where the model refuses to let heavy things remain heavy.

Examples:
- consequence_avoidance
- defensive_positive_drift
- tension_premature_resolution
- impact_soft_landing
- darkness_intolerance

## Public README Principle

For the public GitHub page, maintain the Duolingo structure:

- one public `README.md`
- first-line jump links for English and 简体中文
- no large language banners
- clear separation between the two language sections
- no mixed-language contamination inside either section

This should be treated as a stable design rule, not a one-off formatting choice.

## Recommended Repository Structure

```text
cn-failure-atlas/
├── README.md
├── docs/
│   ├── manifesto.md
│   ├── project-thesis.md
│   ├── executive-plan.md
│   ├── literature-map.md
│   ├── failure-families.md
│   ├── failure-taxonomy-core.md
│   ├── failure-taxonomy-advanced.md
│   ├── casebook-method.md
│   ├── advanced-failure-notes.md
│   ├── why-models-feel-fake.md
│   ├── annotation-guidelines.md
│   ├── case-schema.md
│   ├── rubric.md
│   ├── style-guidelines.md
│   ├── ontology-adaptation.md
│   └── coverage-map.md
├── atlas/
│   ├── core/
│   ├── advanced/
│   └── index.md
├── casebook/
│   ├── hidden-hurt/
│   ├── asymmetry/
│   ├── desire/
│   ├── consequence/
│   ├── narrative-template/
│   └── index.md
├── data/
│   ├── templates/
│   ├── cases/
│   │   └── pilot/
│   └── schema/
├── eval/
│   ├── prompts/
│   ├── self_eval/
│   └── notes/
└── examples/
```

## Execution Order

### Phase 1 — Lock the pivot in writing

Create:
- `docs/executive-plan.md`
- `docs/manifesto.md`
- `docs/failure-families.md`

Goal: freeze the atlas-first identity and the five-family structure.

### Phase 2 — Split taxonomy into core and advanced layers

Create:
- `docs/failure-taxonomy-core.md`
- `docs/failure-taxonomy-advanced.md`

Goal: separate stable, public-facing foundational failures from the more distinctive, harder-to-formalize advanced ones.

### Phase 3 — Define casebook method

Create:
- `docs/casebook-method.md`
- `docs/advanced-failure-notes.md`
- `docs/why-models-feel-fake.md`

Goal: explain how examples are chosen, how "reader drop" is documented, and how advanced failure notes should be written.

### Phase 4 — Reconcile the formal subset

Update:
- `docs/project-thesis.md`
- `docs/rubric.md`
- `docs/annotation-guidelines.md`
- `docs/coverage-map.md`

Goal: keep the benchmark-compatible subset, but subordinate it to the atlas identity.

### Phase 5 — Build demonstrative content

Create:
- first atlas pages
- first casebook entries
- a few more pilot cases where useful

Goal: give the repo real proof of concept, not only planning docs.

## What Not To Do Yet

- do not force every advanced failure into a numeric score
- do not expand the pilot subset faster than the taxonomy stabilizes
- do not let the repo become pure theory without examples
- do not let the examples become unstructured aesthetic commentary

The repo should remain disciplined, but it should not pretend that every subtle failure is already benchmark-ready.

## Intended Outcome

At the end of this refactor, CN Failure Atlas should read as:

- conceptually clear
- structurally original
- useful to technically literate readers
- recognizable to experienced RP users
- compatible with future evaluation work without being reduced to it

The project should help readers name failures they already feel, and distinguish between polished output and narratively true output.
