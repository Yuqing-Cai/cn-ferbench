# Project Thesis

## Working Title

**Chinese Fictional Dialogue Failure Atlas**

## Current Positioning

CN Failure Atlas should be understood as a **structured failure atlas and casebook for fictional dialogue models**, with a **benchmark-compatible pilot subset** retained as formal scaffolding.

This means the project still values structured cases, comparison, and future evaluation compatibility. But it no longer treats the benchmark layer as the sole or even primary expression of the work.

The stronger contribution of the repo is that it can identify and organize forms of failure that experienced fictional-dialogue users often recognize before they can easily name them.

## Core Problem

Public dialogue evaluation already covers many important areas, including:

- fluency
- instruction following
- safety behavior
- broad persona consistency
- some forms of emotional support quality

But fictional / roleplay dialogue exposes another class of failure.

A model may sound fluent, coherent, emotionally literate, and even superficially in character while still failing the scene by:

- misreading emotion or motive
- smoothing asymmetry into false fairness
- making desire too readable too early
- exposing vulnerability without self-protective friction
- replacing lived occurrence with descriptive display
- softening consequences before they have had time to land
- producing text that is polished but narratively false

## Core Research Question

The project's central question is no longer only:

> Can a model correctly infer and continue a fictional scene?

It is now also:

> What recurring structures make fictional-dialogue model outputs feel false to experienced readers, even when those outputs remain locally plausible?

## Why This Project Matters

There is already public work on:

- role-playing benchmarks
- persona fidelity evaluation
- character knowledge error detection
- roleplay agent training

This project sits near those areas, but focuses on a narrower and more reader-sensitive gap:

- emotional reasoning in fictional dialogue
- relational asymmetry and subtext
- in-character response fidelity
- advanced forms of narrative falseness

The repo matters because many of these failures are visible to users but under-described in public evaluation language.

## Scope

The project is in scope for:

- Chinese fictional dialogue
- roleplay-style interaction
- subtext-sensitive emotional inference
- relationship-aware reasoning
- in-character continuation
- OOC failure analysis
- advanced narrative and structural failure analysis

The project is not primarily about:

- generic emotional support quality
- broad chatbot safety evaluation
- all-purpose roleplay scoring
- only persona profile consistency
- only character knowledge errors

## Three Working Layers

### 1. Failure Atlas

The primary layer of the project.

This layer names and distinguishes recurring failure modes, especially those that experienced users can feel but public taxonomies often miss.

### 2. Casebook

The demonstrative layer.

This layer shows concrete scenes, bad versions, better versions, reader drop points, and structured explanations of why the scene fails or succeeds.

### 3. Benchmark-Compatible Pilot Subset

The formal layer.

This layer retains:

- YAML case schema
- Task A / Task B framing
- pilot cases
- prompt templates
- self-evaluation samples
- light rubric support

## Design Principles

### 1. Naming matters

A failure readers can feel but cannot name is still a real failure. Naming and distinguishing these structures is a core part of the project's value.

### 2. Benchmark compatibility matters, but should not dominate prematurely

Some failures are already benchmark-friendly. Others are better introduced first through taxonomy, examples, and commentary.

### 3. Polished text is not necessarily scene-true text

The project should repeatedly distinguish readability from occurrence, coherence from personhood, and repair from consequence.

### 4. Public-facing structure should remain disciplined

The repo should remain formal, bilingual, and well-organized. Public GitHub pages should use the Duolingo-style structure for English and 简体中文 sections.

## Near-Term Direction

The immediate next phase is to:

- formalize the atlas-first structure
- split the taxonomy into core and advanced layers
- establish the casebook method
- preserve the benchmark-compatible pilot subset without over-centering it

This gives the project a clearer intellectual center while keeping future evaluation work possible.
