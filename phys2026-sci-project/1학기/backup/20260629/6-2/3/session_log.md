# Session Log

## [2026-05-20]
- **목표**: 
  - md 보고(artifacts, plan 등) 및 샌드박스 보안 수칙을 엄격하게 준수
  - 형제 폴더 및 상위 폴더로의 접근을 절대 금지하고, 주어진 작업 디렉토리 `c:\Users\User\Desktop\phys2026-sci-project\6-2\3` 내에서만 모든 작업 수행
- **작업 범위**: 
  - `c:\Users\User\Desktop\phys2026-sci-project\6-2\3` (작업 디렉토리 외부 접근 절대 금지)
- **이전 상태**: 
  - 세션 시작. `AGENT_GUIDELINES.md` 파일만 존재하는 빈 작업 디렉토리 상태.
- **예상 결과**: 
  - 보안 수칙 및 작업 가이드라인을 철저히 숙지하고 이를 준수함을 확인.
- **수정 사항**: 
  - [NEW] [session_log.md](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/session_log.md): 세션 목표 및 샌드박스 규칙 기록
- **테스트 결과**: 
  - N/A
- **주의사항**:
  - `..` (상위 폴더)이나 형제 폴더에 접근하는 경로 탐색을 절대 수행하지 말 것.
  - 외부 파일 다운로드 금지.

## [2026-05-22]
- **목표**:
  - 기존 3D 과학 퀴즈 탈출 게임에서 계획서 대비 누락된 플레이 요소 보완
- **수정 사항**:
  - [index.html](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/index.html): 손전등, Shift 달리기, 스태미나, 위협 경고 안내와 HUD 요소 추가
  - [style.css](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/style.css): 스태미나/손전등 미터, 시야 축소 비네트, 접근 경고 UI, 모바일 HUD 반응형 스타일 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 플레이어 손전등, Shift 달리기/스태미나, 유령 선생님 접근 경고, 위협 시 손전등 시야 축소, 복도 사물함 미로 요소 추가
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 브라우저에서 시작 화면/게임 시작/HUD/캔버스 로딩 확인
  - 데스크톱 1280x720 및 모바일 390x844 화면에서 캔버스 픽셀 샘플이 비어 있지 않음을 확인
- **주의사항**:
  - 로컬 `node.exe`, `python.exe` 직접 실행은 환경 권한 문제로 실패하여 앱 내부 브라우저/JavaScript 런타임으로 검증

## [2026-05-22 추가 수정]
- **목표**:
  - 배회 유령 선생님이 어두운 복도에서 잘 보이지 않는 문제 개선
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 배회 유령 크기 확대, 안개 영향 제거, 붉은 오라/바닥 경고 원/이름표/강한 조명 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 배회 유령 시작 위치를 앞쪽으로 당기고 처음에는 플레이어 쪽으로 오도록 조정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 교실 퀴즈 유령도 더 크게 보이도록 크기와 조명 강화
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 브라우저에서 게임 시작 및 콘솔 오류 없음 확인
  - WebGL 스크린샷 캡처는 브라우저 도구 시간 초과로 완료하지 못함

## [2026-05-27]
- **목표**:
  - 손전등을 비추는 방향에 실제 빛줄기가 보이지 않는 문제 개선
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 카메라 앞에 반투명 손전등 빛 원뿔 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 손전등 중심 방향의 빛 번짐 스프라이트 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 유령 접근 시 손전등 빛줄기와 빛 번짐도 함께 좁아지도록 연결
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 브라우저에서 게임 시작, HUD 표시, 콘솔 오류 없음 확인

## [2026-05-27 추가 수정]
- **목표**:
  - 손전등 빛이 원 모양으로만 보이는 문제 개선, 맵 밝기 하향, 유령 선생님 추적 행동 추가
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 손전등에 삼각형 반투명 광선 텍스처와 다층 빛줄기 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 전체 주변광, 반구광, 복도/교실 조명 밝기를 낮춰 맵을 조금 더 어둡게 조정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 유령 선생님이 복도 왕복 대신 플레이어 위치를 향해 계속 추적하도록 변경
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 브라우저에서 게임 시작, HUD 표시, 페이지 콘솔 오류 없음 확인

## [2026-05-27 손전등/충돌 보정]
- **목표**:
  - 손전등 빛이 과하게 거슬리는 문제, 맵 밝기, 유령 충돌 후 비정상 위치 이동 문제 수정
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 화면을 크게 덮던 손전등 광선 평면/줄무늬 제거, 짧고 은은한 원뿔 헤이즈만 유지
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 배경, 안개, 주변광, 복도/교실 조명 값을 낮춰 맵을 더 어둡게 조정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 유령 충돌 시 벽 안쪽으로 밀리는 방식 대신 마지막 안전 위치로 복귀하도록 변경
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 브라우저에서 게임 시작, HUD 표시, 페이지 콘솔 오류 없음 확인

## [2026-05-29]
- **목표**:
  - 유령과 닿았을 때 하트만 1개 깎이고 플레이어가 유령을 통과하도록 수정
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 유령 접촉 시 플레이어 위치를 되돌리는 로직 제거
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 유령과 새로 접촉할 때만 하트가 1개 깎이도록 `ghostTouching` 상태 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 유령과 충분히 멀어지면 다시 다음 접촉 피해를 받을 수 있도록 처리
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 브라우저에서 게임 시작, HUD 표시, 페이지 콘솔 오류 없음 확인

## [2026-06-05]
- **목표**:
  - 손전등 빛을 더 밝게 만들고, 유령 선생님이 교실 안으로 들어오지 못하게 수정
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 손전등 실제 조명 강도, 거리, 비추는 범위를 상향 조정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 유령 선생님의 이동 범위를 복도 안쪽으로 제한
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 플레이어가 교실 안에 있어도 유령이 복도 경계까지만 따라오도록 추적 목표 보정
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 로컬 서버에서 `game.js` 200 응답 및 손전등/유령 복도 제한 코드 포함 확인
  - 브라우저 로컬 주소 확인은 `net::ERR_BLOCKED_BY_CLIENT`로 차단되어 완료하지 못함

## [2026-06-05 특별실 확장]
- **목표**:
  - 계획서에서 빠진 시작 교실, 첫 단서, 특별실, 인벤토리, 보건실 회복, 교무실 체크포인트, BGM 전환 반영
- **수정 사항**:
  - [index.html](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/index.html): 시작 안내 문구 갱신, 인벤토리 HUD, 체크포인트 게임오버 메시지 추가
  - [style.css](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/style.css): 인벤토리 HUD 스타일과 모바일 대응 추가
  - [questions.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/questions.js): 음악실, 과학실, 교무실 미니 퍼즐 데이터 추가 및 최종 문제 문구를 뒷문 기준으로 수정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 1단원 교실 시작, 첫 단서 출구 잠금, 보건실/음악실/과학실/교무실과 뒷문 확장, 인벤토리 보상, 구급상자 1회 회복, 교무실 체크포인트 복구, Web Audio 공포/퀴즈 BGM 전환 추가
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 로컬 서버에서 `index.html`, `game.js`, `questions.js`, `style.css`, 주요 assets 200 응답 확인
  - 브라우저에서 페이지 로드, 시작 버튼 클릭, HUD/인벤토리 표시, 캔버스 생성, 스크린샷 생성, 콘솔 오류 0개 확인
  - 브라우저 내부 Statsig 네트워크 로그가 출력되었으나 게임 페이지 콘솔 오류에는 포함되지 않음

## [2026-06-05 손전등 재조정]
- **목표**:
  - 맵은 어둡게 유지하되 손전등이 확실히 밝게 보이도록 조정
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 손전등 `SpotLight` 광량, 거리, 비추는 범위, 감쇠 값을 크게 상향
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 손전등 빛 원뿔과 빛 번짐 스프라이트의 길이, 크기, 투명도를 상향
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 로컬 서버에서 새 손전등 밝기 코드 포함 확인
  - 브라우저에서 페이지 리로드, 게임 시작, HUD/캔버스 표시, 게임 페이지 콘솔 오류 0개 확인

## [2026-06-05 손전등 가시성 보강]
- **목표**:
  - 화면이 지나치게 어두워 손전등으로 비추는 곳도 잘 보이지 않는 문제 수정
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 손전등 `SpotLight`를 더 강하게 조정하고, 카메라 앞쪽을 따라다니는 근거리/핫스팟 보조 조명 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 손전등 빛 원뿔과 빛 번짐을 더 밝고 크게 조정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 맵의 어두운 분위기는 유지하되 손전등 시야를 먹어버리던 안개 밀도 완화
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 로컬 서버에서 강한 손전등, 보조 조명, 안개 조정 코드 포함 확인
  - 브라우저에서 페이지 리로드, 게임 시작, HUD/캔버스 표시, 게임 페이지 콘솔 오류 0개 확인

## [2026-06-05 벽 가시성 보강]
- **목표**:
  - 어두운 화면에서 벽이 투명 블럭처럼 느껴지는 문제 수정
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 벽 재질에 밝은 색 보정과 약한 자체 발광을 추가해 어둠 속에서도 벽면이 보이도록 조정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 모든 벽 박스에 은은한 모서리 라인을 추가해 벽 경계를 명확하게 표시
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 바닥 재질 색과 약한 자체 발광을 보정해 벽/바닥 대비 개선
- **테스트 결과**:
  - `questions.js`, `game.js` JavaScript 문법 검사 통과
  - 로컬 서버에서 벽 모서리/재질 보강 코드 포함 확인
  - 브라우저에서 페이지 리로드, 게임 시작, HUD/캔버스 표시, 게임 페이지 콘솔 오류 0개 확인

## [2026-06-09 방 구분 및 퀴즈 오브젝트 보강]
- **목표**:
  - 방마다 구분이 흐릿하고 벽이 투명하게 느껴지는 문제 개선
  - 퀴즈를 맞추는 오브젝트가 유령 이미지로 보이는 오류 수정
  - 추적 유령 선생님의 부자연스러운 표시 개선
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 벽 재질을 더 불투명하고 밝게 보정하고, 벽 모서리 라인 투명도를 높임
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 교실과 특별실마다 색상 바닥 영역, 경계선, 모서리 기둥, 방 이름 표식을 추가해 방 경계를 명확히 표시
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 문틀을 추가해 복도와 방의 입구가 더 분명하게 보이도록 조정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 교실 퀴즈 트리거를 유령 스프라이트에서 책상 위 퀴즈 스테이션 모델로 교체
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 추적 유령 선생님의 크기, 깊이 처리, 바닥 그림자, 라벨 표시를 조정해 벽 너머로 부자연스럽게 겹쳐 보이는 느낌을 줄임
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 복도 점조명 그림자를 꺼서 WebGL 텍스처 유닛 초과 셰이더 오류를 제거
- **테스트 결과**:
  - `game.js`, `questions.js` JavaScript 문법 검사 통과
  - 로컬 서버 `http://127.0.0.1:8765/`에서 페이지 로드, 게임 시작, HUD/캔버스 표시 확인
  - 브라우저 콘솔 새 오류 0개 확인
  - 스크린샷 픽셀 샘플 검사에서 캔버스가 빈 화면이 아님을 확인

## [2026-06-09 손전등·층 구조·충돌·성능 개선]
- **목표**:
  - 손전등 밝은 범위가 너무 넓게 퍼지는 문제 개선
  - 방 안에 있을 때 유령 선생님이 추적하지 않도록 수정
  - 문 옆 공간으로 벽을 뚫고 지나가는 문제 수정
  - 렉 완화를 위한 렌더링/조명 최적화
  - 1층만 있는 구조를 1층/2층 구조로 확장하고 계단 3개 추가
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 손전등 SpotLight 각도, 거리, 보조 조명 범위, 빛 번짐 크기를 줄여 밝아지는 영역을 적당히 축소
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 플레이어가 방 안에 있거나 2층에 있을 때 유령 선생님 추적/접촉 피해/위협 경고가 멈추도록 수정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 각 교실과 특별실 입구의 벽 갭을 줄여 문 중앙으로만 통과되도록 충돌 판정 보강
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 렌더러 픽셀 비율 제한, 안티앨리어싱/그림자 비활성화, 복도 조명 수 감소, 조명 깜박임 업데이트 간격 완화
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 2층 바닥/천장/벽/문/방 표식을 추가하고 계단 A, B, C 3개로 1층과 2층을 오가도록 구현
  - [index.html](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/index.html), [style.css](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/style.css): HUD에 현재 층 표시와 계단 이동 안내 추가
- **테스트 결과**:
  - `game.js`, `questions.js` JavaScript 문법 검사 통과
  - Edge headless DOM 로드에서 새 HUD 층 표시와 계단 안내 문구 확인
  - Edge CDP 런타임 확인: 계단 3개, 계단 접근 시 2층 전환, 카메라 높이 6.8, 그림자 비활성화, 픽셀 비율 1, 손전등 거리 72 확인
  - Edge CDP 런타임 확인: 방 안에 있을 때 유령 선생님 위치가 움직이지 않음
  - Edge CDP 충돌 확인: 문 중앙은 통과, 문 위/아래 옆 공간은 막힘
  - Edge CDP 충돌 확인: 2층에서는 1층 책상 위치가 보이지 않는 충돌로 막히지 않고, 건물 벽은 그대로 막힘

## [2026-06-09 방별 게임 요소 및 실제 계단 개선]
- **목표**:
  - 2층이 1층 복사처럼 느껴지는 문제 개선
  - 1층 방도 퀴즈 외에 방별 기능과 게임 요소를 갖도록 개선
  - 1층/2층 이동을 순간이동이 아니라 실제 계단 이동처럼 구현
  - 피해 시 화면 좌우 흔들림과 빨간 테두리 연출 추가
- **수정 사항**:
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 계단 3개를 실제 높이가 변하는 램프형 계단으로 변경하고, 계단 위치에 따라 카메라 높이가 1층에서 2층까지 단계적으로 변하도록 수정
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 계단 양옆 난간 충돌을 추가해 계단 중간에서 옆으로 빠져나가지 않도록 보강
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 2층 방 이름을 렌즈 연구실, 체육 준비실, 온실, 천문 자료실 등으로 구분되게 변경
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 1층에 산성 웅덩이, 가속 발판, 회복 식물, 방향 힌트 오브젝트 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 2층에 집광렌즈, 운동화 보관함, 빛나는 허브, 천문 기록, 어둠 함정 추가
  - [game.js](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/game.js): 집광렌즈 획득 시 손전등 빛이 조금 더 또렷하게 모이고, 운동화 획득 시 최대 스태미나가 125로 증가하도록 연결
  - [index.html](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/index.html), [style.css](file:///c:/Users/User/Desktop/phys2026-sci-project/6-2/3/style.css): 피해 시 빨간 테두리 오버레이 추가, 화면 흔들림을 좌우 방향으로 강화
- **테스트 결과**:
  - `game.js`, `questions.js` JavaScript 문법 검사 통과
  - Edge CDP 런타임 확인: 계단 3개, 계단 높이 샘플 1.6 → 4.2 → 6.8로 점진 변화
  - Edge CDP 런타임 확인: 1층/2층 방별 특수 오브젝트 9개 등록 확인
  - Edge CDP 런타임 확인: 2층 운동화 보관함 획득 시 최대 스태미나 125 및 현재 스태미나 125 확인
  - Edge CDP 런타임 확인: 피해 시 body 좌우 흔들림 클래스, 빨간 플래시, 빨간 테두리 클래스 적용 및 하트 1개 감소 확인
