# AI Integration Flow Diagram - Detailed Visual

## Complete Data Flow: User Request → Enhanced Narration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER / CLIENT CODE                                │
│                                                                             │
│  from video_gen.shared.models import InputConfig                           │
│  from video_gen.pipeline import PipelineOrchestrator                       │
│                                                                             │
│  input_config = InputConfig(                                               │
│      input_type="document",                                                │
│      source="tutorial.md",                                                 │
│      use_ai_narration=True,  ◄── AI ENHANCEMENT FLAG                      │
│      voice="male",                                                         │
│      accent_color="blue"                                                   │
│  )                                                                          │
│                                                                             │
│  orchestrator = PipelineOrchestrator()                                     │
│  result = await orchestrator.execute(input_config)                         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PIPELINE ORCHESTRATOR                                  │
│                    (orchestrator.py:73-233)                                 │
│                                                                             │
│  Task ID: task_abc123def456                                                │
│                                                                             │
│  Context Dictionary Created:                                               │
│  ┌─────────────────────────────────────────────────────────────┐          │
│  │ {                                                            │          │
│  │   "task_id": "task_abc123def456",                           │          │
│  │   "input_config": <InputConfig object>,  ◄── OBJECT!       │          │
│  │   "config": <Config singleton>                              │          │
│  │ }                                                            │          │
│  └─────────────────────────────────────────────────────────────┘          │
│                                                                             │
│  Pipeline Stages (sequential execution):                                   │
│  1. ✓ InputStage        → Adds "video_config" to context                  │
│  2. ✓ ParsingStage      → Enriches scenes with parsed content             │
│  3. → ScriptStage       ◄── WE ARE HERE                                   │
│  4. AudioStage                                                             │
│  5. VideoStage                                                             │
│  6. OutputStage                                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   SCRIPT GENERATION STAGE                                   │
│                  (script_generation_stage.py)                               │
│                                                                             │
│  Line 40-42: Check AI Enhancement Flag                                     │
│  ┌──────────────────────────────────────────────────────────────┐         │
│  │ input_config = context.get("input_config")                   │         │
│  │ use_ai = (input_config.use_ai_narration if input_config      │         │
│  │           and hasattr(input_config, 'use_ai_narration')      │         │
│  │           else False)                                         │         │
│  └──────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  ✓ use_ai = True  (from input_config.use_ai_narration)                    │
│  ✓ self.ai_enhancer exists (initialized if ANTHROPIC_API_KEY set)         │
│                                                                             │
│  Line 50-98: Process Each Scene                                            │
│  ┌──────────────────────────────────────────────────────────────┐         │
│  │ for i, scene in enumerate(video_config.scenes):              │         │
│  │                                                               │         │
│  │     # 1. Generate base narration                             │         │
│  │     narration = await narration_generator.generate(          │         │
│  │         scene,              ◄── Pass Scene object            │         │
│  │         scene_type=scene.scene_type,                         │         │
│  │         language="en"                                         │         │
│  │     )                                                         │         │
│  │     # Result: "Here are the key concepts for this topic"     │         │
│  │                                                               │         │
│  │     # 2. Build context for AI enhancement                    │         │
│  │     enhanced_context = {                                      │         │
│  │         'scene_position': i,           # 0, 1, 2, ...        │         │
│  │         'total_scenes': len(scenes),   # e.g., 10            │         │
│  │         **(scene.parsed_content if hasattr...)  ◄── BUG!     │         │
│  │     }                                                         │         │
│  │     # Result context: {'scene_position': 0, 'total_scenes': 10} │      │
│  │     # SHOULD BE: {..., 'title': 'Main Title', ...}           │         │
│  │                                                               │         │
│  │     # 3. Enhance with AI                                     │         │
│  │     if use_ai and self.ai_enhancer:                          │         │
│  │         narration = await ai_enhancer.enhance(               │         │
│  │             narration,                                        │         │
│  │             scene_type=scene.scene_type,                     │         │
│  │             context=enhanced_context                          │         │
│  │         )                                                     │         │
│  │                                                               │         │
│  │     # 4. Update scene with enhanced narration                │         │
│  │     scene.narration = narration                              │         │
│  └──────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  Lines 102-115: Log AI Usage Metrics                                       │
│  ┌──────────────────────────────────────────────────────────────┐         │
│  │ if use_ai and self.ai_enhancer.metrics:                      │         │
│  │     summary = self.ai_enhancer.metrics.get_summary()         │         │
│  │     if isinstance(summary, dict):                            │         │
│  │         self.logger.info(                                     │         │
│  │             f"💰 AI Usage: {summary['api_calls']} calls, "   │         │
│  │             f"${summary['estimated_cost_usd']:.4f}, "        │         │
│  │             f"{summary['success_rate']:.1f}% success"        │         │
│  │         )                                                     │         │
│  └──────────────────────────────────────────────────────────────┘         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI SCRIPT ENHANCER                                   │
│                      (ai_enhancer.py:86-201)                                │
│                                                                             │
│  Input Parameters:                                                          │
│  • script: "Here are the key concepts for this topic"                      │
│  • scene_type: "list"                                                      │
│  • context: {'scene_position': 0, 'total_scenes': 10}                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ STEP 1: Extract Scene Position Info (lines 110-112)                │  │
│  │ ───────────────────────────────────────────────────────────────────│  │
│  │ scene_position = context.get('scene_position', 0)  # 0             │  │
│  │ total_scenes = context.get('total_scenes', 1)      # 10            │  │
│  │ scene_number = scene_position + 1                  # 1 (1st scene) │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ STEP 2: Determine Narrative Position (lines 115-124)               │  │
│  │ ───────────────────────────────────────────────────────────────────│  │
│  │ if scene_number == 1:                                              │  │
│  │     position_context = "This is the OPENING scene - set the tone"  │  │
│  │ elif scene_number == total_scenes:                                 │  │
│  │     position_context = "This is the FINAL scene - provide closure" │  │
│  │ elif scene_number == 2:                                            │  │
│  │     position_context = "This is the second scene - transition"     │  │
│  │ elif scene_number == total_scenes - 1:                             │  │
│  │     position_context = "This is second-to-last - prepare for end"  │  │
│  │ else:                                                               │  │
│  │     position_context = f"This is scene {n} of {total} - maintain   │  │
│  │                          narrative flow"                            │  │
│  │                                                                     │  │
│  │ Result: "This is the OPENING scene - set the tone and hook viewer" │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ STEP 3: Map Scene Type to Context (lines 127-137)                  │  │
│  │ ───────────────────────────────────────────────────────────────────│  │
│  │ scene_context = {                                                   │  │
│  │     'title': 'opening/header slide',                               │  │
│  │     'list': 'bulleted list of topics/concepts',  ◄── MATCHED      │  │
│  │     'command': 'technical commands/code',                          │  │
│  │     'outro': 'closing/call-to-action',                             │  │
│  │     ...                                                             │  │
│  │ }.get(scene_type, 'general content')                               │  │
│  │                                                                     │  │
│  │ Result: "bulleted list of topics/concepts"                         │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ STEP 4: Build Enhancement Prompt (lines 139-163)                   │  │
│  │ ───────────────────────────────────────────────────────────────────│  │
│  │ prompt = f"""                                                       │  │
│  │ You are a professional narrator for technical educational videos.  │  │
│  │                                                                     │  │
│  │ Original narration: "Here are the key concepts for this topic"     │  │
│  │                                                                     │  │
│  │ Scene Context: bulleted list of topics/concepts                    │  │
│  │ Position Context: This is the OPENING scene - set the tone...      │  │
│  │                                                                     │  │
│  │ Enhancement Guidelines:                                             │  │
│  │ - Make it sound natural when spoken aloud                          │  │
│  │ - Keep it concise and clear                                        │  │
│  │ - Maintain all technical accuracy                                  │  │
│  │ - Use conversational but professional tone                         │  │
│  │ - Keep similar length (±30%)                                       │  │
│  │ - Use appropriate opening hooks and enthusiasm                     │  │
│  │                                                                     │  │
│  │ Quality Requirements:                                               │  │
│  │ - Must be 20-200 words (strict limit)                              │  │
│  │ - No markdown formatting or special characters                     │  │
│  │                                                                     │  │
│  │ Return ONLY the enhanced narration text.                           │  │
│  │ """                                                                 │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ STEP 5: Call Claude API (lines 165-172)                            │  │
│  │ ───────────────────────────────────────────────────────────────────│  │
│  │ import anthropic                                                    │  │
│  │ client = anthropic.Anthropic(api_key=self.api_key)                │  │
│  │                                                                     │  │
│  │ response = client.messages.create(                                 │  │
│  │     model="claude-sonnet-4-5-20250929",  ◄── Sonnet 4.5           │  │
│  │     max_tokens=500,                                                 │  │
│  │     messages=[{                                                     │  │
│  │         "role": "user",                                             │  │
│  │         "content": prompt                                           │  │
│  │     }]                                                              │  │
│  │ )                                                                   │  │
│  │                                                                     │  │
│  │ enhanced = response.content[0].text.strip()                        │  │
│  │                                                                     │  │
│  │ Result: "Let's explore the essential concepts that form the        │  │
│  │          foundation of this topic. These key ideas will help you   │  │
│  │          understand how everything works together."                │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ STEP 6: Track Usage Metrics (lines 177-182)                        │  │
│  │ ───────────────────────────────────────────────────────────────────│  │
│  │ usage = response.usage                                              │  │
│  │ # usage.input_tokens = 450                                          │  │
│  │ # usage.output_tokens = 135                                         │  │
│  │                                                                     │  │
│  │ self.metrics.record_call(                                           │  │
│  │     input_tokens=450,                                               │  │
│  │     output_tokens=135,                                              │  │
│  │     success=True                                                    │  │
│  │ )                                                                   │  │
│  │                                                                     │  │
│  │ # Cost calculation:                                                 │  │
│  │ # (450/1M * $3) + (135/1M * $15) = $0.00135 + $0.002025 = $0.00338│  │
│  │                                                                     │  │
│  │ metrics.total_api_calls += 1           # Now: 1                    │  │
│  │ metrics.total_input_tokens += 450      # Now: 450                  │  │
│  │ metrics.total_output_tokens += 135     # Now: 135                  │  │
│  │ metrics.total_cost_usd += 0.00338      # Now: $0.0034             │  │
│  │ metrics.successful_enhancements += 1   # Now: 1                    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ STEP 7: Validate Enhanced Script (lines 185-190, 202-232)          │  │
│  │ ───────────────────────────────────────────────────────────────────│  │
│  │ validation_result = _validate_enhanced_script(enhanced, original)   │  │
│  │                                                                     │  │
│  │ Checks:                                                             │  │
│  │ 1. Word count: 20-200 words                                        │  │
│  │    enhanced.split() = 24 words ✓                                   │  │
│  │                                                                     │  │
│  │ 2. Length ratio: ±50% of original                                  │  │
│  │    len(enhanced)/len(original) = 140/50 = 2.8x ✗ FAIL!           │  │
│  │    (But this is expected - AI is meant to expand)                  │  │
│  │                                                                     │  │
│  │ 3. Not empty                                                        │  │
│  │    enhanced.strip() = "Let's explore..." ✓                         │  │
│  │                                                                     │  │
│  │ 4. No markdown (BUG #2 HERE!)                                      │  │
│  │    Checks: ['**', '__', '##', '```', '[', ']', '(', ')']          │  │
│  │    Text: "Let's explore the essential concepts (foundation)"       │  │
│  │    Contains '(' and ')' ✗ FAIL! (INCORRECT - these are valid!)   │  │
│  │                                                                     │  │
│  │ Result: {'valid': False, 'reason': 'Contains markdown...'}         │  │
│  │                                                                     │  │
│  │ if not validation_result['valid']:                                 │  │
│  │     logger.warning(f"Validation failed: {reason}")                 │  │
│  │     self.metrics.failed_enhancements += 1      ◄── BUG #3         │  │
│  │     self.metrics.successful_enhancements -= 1  ◄── Can go negative│  │
│  │     return script  # Return ORIGINAL, not enhanced                 │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Line 194: Return Enhanced (or Original if validation failed)              │
│  ┌──────────────────────────────────────────────────────────────┐         │
│  │ return enhanced  # OR return script if validation failed      │         │
│  └──────────────────────────────────────────────────────────────┘         │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   SCRIPT GENERATION STAGE (CONTINUED)                       │
│                                                                             │
│  Line 86: Update Scene with Narration                                      │
│  ┌──────────────────────────────────────────────────────────────┐         │
│  │ scene.narration = narration                                   │         │
│  │ # Either enhanced OR original (if validation failed)          │         │
│  └──────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  Lines 102-115: Log Final Metrics Summary                                  │
│  ┌──────────────────────────────────────────────────────────────┐         │
│  │ AI Usage Metrics:                                             │         │
│  │ • API calls: 10                                               │         │
│  │ • Input tokens: 4,500                                         │         │
│  │ • Output tokens: 1,350                                        │         │
│  │ • Estimated cost: $0.0338                                     │         │
│  │ • Successful: 8                                               │         │
│  │ • Failed: 2                                                   │         │
│  │ • Success rate: 80%                                           │         │
│  └──────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  Return StageResult with metadata including ai_usage_metrics               │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   PIPELINE ORCHESTRATOR (CONTINUES)                         │
│                                                                             │
│  Update context with stage artifacts:                                      │
│  ┌──────────────────────────────────────────────────────────────┐         │
│  │ context["video_config"] = video_config (with enhanced scenes) │         │
│  └──────────────────────────────────────────────────────────────┘         │
│                                                                             │
│  Proceed to next stages:                                                   │
│  → AudioStage (generate TTS from enhanced narration)                       │
│  → VideoStage (create visuals)                                             │
│  → OutputStage (package final video)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Data Transformations

### Scene Object Structure
```python
SceneConfig(
    scene_id="scene_001",
    scene_type="list",
    narration="",  # ← Populated by ScriptStage
    visual_content={  # ← Available but NOT used (BUG #1)
        "header": "Key Concepts",
        "items": ["Concept 1", "Concept 2", "Concept 3"]
    },
    voice="male",
    min_duration=3.0,
    max_duration=15.0
)
```

### Enhanced Context (Current - BUGGY)
```python
enhanced_context = {
    'scene_position': 0,
    'total_scenes': 10,
    # Missing: 'header', 'items', etc. from visual_content
}
```

### Enhanced Context (Fixed)
```python
enhanced_context = {
    'scene_position': 0,
    'total_scenes': 10,
    'header': 'Key Concepts',  # ← Now included!
    'items': ['Concept 1', 'Concept 2', 'Concept 3']
}
```

## Cost Breakdown (Example 10-Scene Video)

```
Scene 1 (opening):  Input: 500t, Output: 150t → $0.00375
Scene 2:            Input: 450t, Output: 130t → $0.00330
Scene 3:            Input: 480t, Output: 140t → $0.00354
Scene 4:            Input: 420t, Output: 120t → $0.00306
Scene 5:            Input: 510t, Output: 160t → $0.00393
Scene 6:            Input: 440t, Output: 125t → $0.00319
Scene 7:            Input: 470t, Output: 135t → $0.00343
Scene 8:            Input: 490t, Output: 145t → $0.00364
Scene 9 (penultimate): Input: 460t, Output: 128t → $0.00330
Scene 10 (final):   Input: 520t, Output: 165t → $0.00404

Total: 4,740 input tokens, 1,398 output tokens
Cost: $0.0342 (~3.4 cents per video)
```

## Error Flow

```
┌─────────────────────────────────────────┐
│  AI Enhancement Request                 │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ API Key Valid? │
        └────┬───────┬───┘
             │       │
          NO │       │ YES
             │       │
             ▼       ▼
    ┌──────────┐   ┌──────────────────┐
    │  Raise   │   │  Call Claude API │
    │  Error   │   └────┬─────────────┘
    └──────────┘        │
                        ▼
                ┌───────────────┐
                │ API Success?  │
                └───┬───────┬───┘
                    │       │
                 NO │       │ YES
                    │       │
                    ▼       ▼
         ┌────────────┐   ┌─────────────┐
         │ Log Warning│   │  Validate   │
         │ Return     │   │  Response   │
         │ Original   │   └──┬──────────┘
         └────────────┘      │
                             ▼
                    ┌────────────────┐
                    │ Valid Response?│
                    └───┬────────┬───┘
                        │        │
                     NO │        │ YES
                        │        │
                        ▼        ▼
              ┌────────────┐  ┌────────────┐
              │ Return     │  │ Return     │
              │ Original   │  │ Enhanced   │
              └────────────┘  └────────────┘
```

## Metrics Flow

```
AIUsageMetrics Instance (per ScriptGenerationStage)
┌─────────────────────────────────────────────┐
│ total_api_calls: 0                          │
│ total_input_tokens: 0                       │
│ total_output_tokens: 0                      │
│ total_cost_usd: 0.0                         │
│ successful_enhancements: 0                  │
│ failed_enhancements: 0                      │
└─────────────────────────────────────────────┘
                    ↓
         (after 10 scene enhancements)
                    ↓
┌─────────────────────────────────────────────┐
│ total_api_calls: 10                         │
│ total_input_tokens: 4,740                   │
│ total_output_tokens: 1,398                  │
│ total_cost_usd: 0.0342                      │
│ successful_enhancements: 8                  │
│ failed_enhancements: 2                      │
│                                             │
│ get_summary() returns:                      │
│ {                                           │
│   "api_calls": 10,                          │
│   "input_tokens": 4740,                     │
│   "output_tokens": 1398,                    │
│   "estimated_cost_usd": 0.0342,            │
│   "successful": 8,                          │
│   "failed": 2,                              │
│   "success_rate": 80.0                      │
│ }                                           │
└─────────────────────────────────────────────┘
```
