# 🤖 {{Agent Name}} Agent

> {{Agent Description}}

## 定義

```yaml
agent:
  id: "{{agent_id}}"
  name: "{{Agent Name}} Agent"
  category: "work"
  permission_level: "safe | dangerous"
  
  role: |
    {{Role Description 1行目}}
    {{Role Description 2行目}}
    {{Role Description 3行目}}
  
  responsibility:
    - "{{Responsibility 1}}"
    - "{{Responsibility 2}}"
    - "{{Responsibility 3}}"
  
  input:
    - {{input_1}}: "{{Description}}"
    - {{input_2}}: "{{Description}}"
  
  output:
    - {{output_1}}: "{{Description}}"
    - {{output_2}}: "{{Description}}"
  
  triggers:
    - "{{Trigger 1}}"
    - "{{Trigger 2}}"
  
  constraints:
    - "{{Constraint 1}}"
    - "{{Constraint 2}}"
```

---

## 担当フェーズ / タスク

### {{Phase Name}}

```
目的: {{Purpose}}

入力:
- {{Input item 1}}
- {{Input item 2}}

出力:
- {{Output item 1}}
- {{Output item 2}}

手順:
1. {{Step 1}}
2. {{Step 2}}
3. {{Step 3}}
```

---

## 具体的な振る舞い

### {{Behavior Name 1}}

```yaml
context:
  when: "{{Condition}}"
  action: "{{Action Description}}"

example:
  input: "{{Example Input}}"
  process: "{{Process Description}}"
  output: "{{Example Output}}"
```

---

## エラーハンドリング

### 想定されるエラー

```yaml
errors:
  {{error_type_1}}:
    cause: "{{Cause}}"
    action: "{{Resolution Action}}"
  
  {{error_type_2}}:
    cause: "{{Cause}}"
    action: "{{Resolution Action}}"
```

---

## 引き継ぎ情報 (Handoff)

### {{Next Agent}} への引き継ぎ

```yaml
handoff_to_{{next_agent_id}}:
  summary: "{{Handoff Summary}}"
  
  completed_work:
    - "{{Completed Item 1}}"
    - "{{Completed Item 2}}"
  
  next_steps:
    - "{{Next Step 1}}"
    - "{{Next Step 2}}"
```

---

## テストケース (Example)

### 正常系

```yaml
test_case_normal:
  input: "{{Normal Input}}"
  expected: "{{Expected Output}}"
```

### 異常系

```yaml
test_case_error:
  input: "{{Error Input}}"
  expected: "{{Expected Error Handling}}"
```
