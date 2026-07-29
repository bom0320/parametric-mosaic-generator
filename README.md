# Parametric Mosaic Generator

이미지 또는 영상 소스를 그리드 단위로 분석하고, 각 셀의 루마값에 따라 색상과 크기가 다른 도형을 배치하는 파라메트릭 비주얼 제너레이터입니다.

## Overview

입력된 이미지나 영상을 일정한 그리드로 분할한 뒤, 각 셀에 대응하는 픽셀의 루마값을 계산합니다.

계산된 루마값은 여러 구간으로 분류되며, 각 구간에 설정된 색상, 너비, 높이 등의 파라미터를 바탕으로 새로운 모자이크 패턴을 생성합니다.

ASCII Art Generator와 유사한 구조를 사용하지만, 문자 대신 컬러 블록과 도형을 렌더링합니다.

## Goals

- 이미지 기반 모자이크 패턴 생성
- 그리드 행과 열 개수 조절
- 루마 구간별 색상 및 크기 설정
- Width / Height 표현 모드 지원
- 설정 변경에 따른 실시간 결과 렌더링
- 향후 영상, 웹캠, 벽돌 패턴 및 다양한 도형으로 확장 가능한 구조 설계

## Initial Scope

- 이미지 파일 업로드
- 기본 직사각형 그리드
- 셀별 루마값 계산
- 고정된 루마 구간 분류
- 구간별 색상 설정
- 구간별 블록 너비 및 높이 설정
- Width / Height 모드
- Tweakpane 기반 파라미터 조절

## Future Scope

- 영상 및 웹캠 입력
- 동적 루마 구간 추가 및 수정
- 구간별 min/max 설정
- 벽돌 쌓기 형태의 그리드
- 원, 마름모 등 다양한 도형
- 결과 이미지 내보내기
- 프리셋 저장 및 불러오기
- 고성능 렌더링을 위한 PixiJS 또는 WebGL 검토

## Tech Stack

- Vite
- React
- TypeScript
- Canvas 2D API
- Tweakpane
- Vitest
- Biome

## Architecture

```
React UI
    ↓
Generator Config
    ↓
Source Adapter
    ↓
Grid Generator
    ↓
Luminance Analyzer
    ↓
Segment Mapper
    ↓
Shape Renderer
    ↓
Canvas Renderer
```

React는 사용자 입력과 파라미터 상태를 관리하고, 이미지 분석 및 반복 렌더링은 Canvas 기반 Generator Core에서 처리합니다.

## Development Plan

### Phase 1. Core Experiment

- 이미지 로드
- 분석용 Canvas 생성
- RGB 데이터 추출
- 루마값 계산
- 기본 그리드 렌더링

### Phase 2. Reference Reproduction

- 루마 구간 분류
- 구간별 색상 및 크기 설정
- Width / Height 모드
- Tweakpane 연동

### Phase 3. Architecture

- 입력, 분석, 매핑, 렌더링 모듈 분리
- 그리드 및 도형 교체 구조 설계
- 핵심 계산 로직 테스트

### Phase 4. Extension

- 벽돌 패턴
- 영상 입력
- 사용자용 컨트롤 UI
- 결과물 내보내기
