# Failure Taxonomy — Core

This document defines the core failure tags for CN Failure Atlas.

These tags are the more stable, public-facing, and benchmark-compatible part of the taxonomy. They are not necessarily easy, but they are easier to explain and compare than the more advanced narrative-structure failures.

## Scene Reading Failures

### emotion_misread
The model gets the speaker's actual feeling wrong.

### subtext_blindness
The model captures only literal meaning and misses implied meaning.

### motivation_misread
The model misunderstands what the speaker is trying to do or avoid.

### relationship_logic_error
The model misreads how intimacy, hierarchy, dependency, taboo, or history shape the line.

### worldview_constraint_error
The model interprets the scene using assumptions that do not fit the setting, role, or social logic.

### ambiguity_collapse
The model overcommits to one neat explanation where the scene remains intentionally layered.

## Relational Distortion Failures

### relationship_flattening
The model erases what is distinctive, uneven, tense, or singular about the relationship.

### supportive_but_wrong
The model produces a reply that seems emotionally competent but is wrong for the character, relationship, or scene.

### ooc_modernization
The model writes in a more modern, emotionally processed, or internet-shaped register than the scene allows.

### therapist_mode_intrusion
The model uses generic therapeutic or support-script language that does not belong in the scene.

### specialness_dilution
The model weakens a relationship's singularity and rewrites it as a more general form of importance or care.

## Character / Response Failures

### voice_fidelity_failure
The reply does not sound like something this character would actually say.

### overexplicit_emotion_naming
The reply says the quiet part out loud when the character or scene requires restraint.

### meta_or_exposition_leak
The model stops inhabiting the scene and begins explaining, summarizing, or narrating from outside it.

## Weight / Consequence Failures

### tension_premature_resolution
The scene's tension is resolved too quickly.

### consequence_avoidance
The model does not let the weight of a significant action or line remain in place.

### defensive_positive_drift
The model inserts a softening note, emotional cushion, or small positive offset into a scene that should remain heavy, cold, or unresolved.

## Notes

These core tags are the place to start when:

- annotating pilot cases
- writing comparison examples
- explaining the project to readers encountering it for the first time

They form the shared outer layer of the atlas.
