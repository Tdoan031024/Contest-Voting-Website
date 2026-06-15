# Hướng dẫn Tích hợp Cảnh báo DevTools (DevTools Protection)

Tài liệu này hướng dẫn chi tiết cách tích hợp cơ chế phát hiện và hiển thị cảnh báo khi người dùng mở Developer Tools (F12 / Inspect Element) trên các ứng dụng của dự án Contest Voting Platform.

---

## 1. Tổng quan cơ chế hoạt động

Cơ chế bảo vệ DevTools hoạt động dựa trên các nguyên tắc sau:
1. **Phát hiện mở DevTools:** Sử dụng phép so sánh chênh lệch giữa kích thước ngoài (`window.outerWidth` / `window.outerHeight`) và kích thước trong (`window.innerWidth` / `window.innerHeight`). Khi chênh lệch lớn hơn ngưỡng (`threshold = 160px`), DevTools được xác định là đang mở.
2. **Cảnh báo Console:** Xóa console (`console.clear()`) và in một khối chữ nghệ thuật ASCII cực kỳ lớn, có màu đỏ nổi bật để cảnh báo người dùng không dán các mã lạ vào tab này.
3. **Cảnh báo Elements (DOM):** 
   - Tiện ích tự động tạo và chèn một thẻ comment HTML nhiều dòng duy nhất lên đầu thẻ `<body>` chứa cụm chữ nghệ thuật `DUNG LAI !!!` và `HUIT MEDIA` để hiển thị ngay lập tức (không bị thu gọn) mà không làm ảnh hưởng đến giao diện người dùng.
   - Các dấu bao bọc comment mặc định của trình duyệt (`<!--` và `-->`) được kết hợp khéo léo vào đường vẽ viền `─────────────────────────────────────────────────────────────────────────` tạo thành một khung viền đồng bộ.
   - Đồng thời, chèn thêm một thẻ ẩn `<div id="devtools-elements-warning" style="display:none">` chứa thẻ `<pre>` để phục vụ các bài kiểm tra tự động hóa hoặc bổ trợ DOM.
4. **Tự chữa lành DOM (Self-healing):** Sử dụng `MutationObserver` để lắng nghe các thay đổi trong phần tử `<body>`. Nếu người dùng tìm cách xóa hoặc di chuyển thẻ comment / thẻ cảnh báo ẩn, tiện ích sẽ ngay lập tức chèn lại đúng vị trí trên cùng.
5. **Tự động dọn dẹp (Cleanup):** Khi DevTools được đóng lại, cơ chế sẽ tự động gỡ bỏ thẻ comment và thẻ ẩn ra khỏi DOM để trả lại trạng thái sạch cho trang web.

---

## 2. Mã nguồn đầy đủ của Tệp tiện ích (`devtoolsProtection.ts`)

Tệp tiện ích này chứa toàn bộ logic xử lý chính và được đặt tại:
- **Web App:** [apps/web/src/utils/devtoolsProtection.ts](file:///d:/HUIT_PROJECT/Contest%20Voting%20Platform/Contest-Voting-Platform/apps/web/src/utils/devtoolsProtection.ts)
- **Admin App:** [apps/admin/src/utils/devtoolsProtection.ts](file:///d:/HUIT_PROJECT/Contest%20Voting%20Platform/Contest-Voting-Platform/apps/admin/src/utils/devtoolsProtection.ts)

Dưới đây là toàn bộ mã nguồn của file:

```typescript
/**
 * Utility to detect and warn when Developer Tools (DevTools) is opened.
 * Supports console warnings and elements panel warnings with MutationObserver protection.
 */

export type DevToolsProtectionConfig = {
  enabled?: boolean;
  threshold?: number;
  intervalMs?: number;
  showConsoleWarning?: boolean;
  showElementsWarning?: boolean;
  removeElementWhenClosed?: boolean;
};

const DEFAULT_CONFIG: Required<DevToolsProtectionConfig> = {
  enabled: true,
  threshold: 160,
  intervalMs: 500,
  showConsoleWarning: true,
  showElementsWarning: true,
  removeElementWhenClosed: true,
};

const WARNING_ID = 'devtools-elements-warning';

const ASCII_ART = `
██████╗ ██╗   ██╗ ███╗   ██╗  ██████╗   ██╗       █████╗  ██╗   ██╗██╗██╗
██╔══██╗██║   ██║ ████╗  ██║ ██╔════╝   ██║      ██╔══██╗ ██║   ██║██║██║
██║  ██║██║   ██║ ██╔██╗ ██║ ██║  ███╗  ██║      ███████║ ██║   ██║██║██║
██║  ██║██║   ██║ ██║╚██╗██║ ██║   ██║  ██║      ██╔══██║ ██║   ╚═╝╚═╝╚═╝
██████╔╝╚██████╔╝ ██║ ╚████║ ╚██████╔╝  ███████╗ ██║  ██║ ██║   ██╗██╗██╗
╚═════╝  ╚═════╝  ╚═╝  ╚═══╝  ╚═════╝   ╚══════╝ ╚═╝  ╚═╝ ╚═╝   ╚═╝╚═╝╚═╝

─────────────────────────────────────────────────────────────────────────
  Đây là khu vực dành cho nhà phát triển.
  Không sao chép hoặc dán mã lạ vào DevTools.
  Nếu ai đó yêu cầu bạn dán mã vào đây, đó có thể là hành vi lừa đảo
  nhằm chiếm đoạt tài khoản hoặc thông tin cá nhân của bạn.
─────────────────────────────────────────────────────────────────────────

██╗ ██╗ ██╗ ██╗ ██╗ ██████╗    ███╗ ███╗ ███████╗ ██████╗  ██╗  █████╗ 
██║ ██║ ██║ ██║ ██║ ╚═██╔═╝    ████████║ ██╔════╝ ██╔══██╗ ██║ ██╔══██╗
██████║ ██║ ██║ ██║   ██║      ██╔██╔██║ █████╗   ██║  ██║ ██║ ███████║
██╔═██║ ██║ ██║ ██║   ██║      ██║╚═╝██║ ██╔══╝   ██║  ██║ ██║ ██╔══██║
██║ ██║ ╚████╔╝ ██║   ██║      ██║   ██║ ███████╗ ██████╔╝ ██║ ██║  ██║
╚═╝ ╚═╝  ╚═══╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝ ╚══════╝ ╚═════╝  ╚═╝ ╚═╝  ╚═╝
`;

const getWarningComments = (): string[] => {
  return [
    '██████╗ ██╗   ██╗ ███╗   ██╗  ██████╗   ██╗       █████╗  ██╗   ██╗██╗██╗',
    '██╔══██╗██║   ██║ ████╗  ██║ ██╔════╝   ██║      ██╔══██╗ ██║   ██║██║██║',
    '██║  ██║██║   ██║ ██╔██╗ ██║ ██║  ███╗  ██║      ███████║ ██║   ██║██║██║',
    '██║  ██║██║   ██║ ██║╚██╗██║ ██║   ██║  ██║      ██╔══██║ ██║   ╚═╝╚═╝╚═╝',
    '██████╔╝╚██████╔╝ ██║ ╚████║ ╚██████╔╝  ███████╗ ██║  ██║ ██║   ██╗██╗██╗',
    '╚═════╝  ╚═════╝  ╚═╝  ╚═══╝  ╚═════╝   ╚══════╝ ╚═╝  ╚═╝ ╚═╝   ╚═╝╚═╝╚═╝',
    '─────────────────────────────────────────────────────────────────────────',
    '  Đây là khu vực dành cho nhà phát triển.',
    '  Không sao chép hoặc dán mã lạ vào DevTools.',
    '  Nếu ai đó yêu cầu bạn dán mã vào đây, đó có thể là hành vi lừa đảo',
    '  nhằm chiếm đoạt tài khoản hoặc thông tin cá nhân của bạn.',
    '─────────────────────────────────────────────────────────────────────────',
    '██╗ ██╗ ██╗ ██╗ ██╗ ██████╗    ███╗ ███╗ ███████╗ ██████╗  ██╗  █████╗ ',
    '██║ ██║ ██║ ██║ ██║ ╚═██╔═╝    ████████║ ██╔════╝ ██╔══██╗ ██║ ██╔══██╗',
    '██████║ ██║ ██║ ██║   ██║      ██╔██╔██║ █████╗   ██║  ██║ ██║ ███████║',
    '██╔═██║ ██║ ██║ ██║   ██║      ██║╚═╝██║ ██╔══╝   ██║  ██║ ██║ ██╔══██║',
    '██║ ██║ ╚████╔╝ ██║   ██║      ██║   ██║ ███████╗ ██████╔╝ ██║ ██║  ██║',
    '╚═╝ ╚═╝  ╚═══╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝ ╚══════╝ ╚═════╝  ╚═╝ ╚═╝  ╚═╝'
  ];
};

const getWarningCommentText = (): string => {
  const lines = getWarningComments();
  return ` ─────────────────────────────────────────────────────────────────────────\n` +
         lines.join('\n') +
         `\n───────────────────────────────────────────────────────────────────────── `;
};

let observer: MutationObserver | null = null;

/**
 * Displays a warning in the Console tab.
 */
export function showConsoleWarning(): void {
  console.clear();
  console.log(
    `%c${ASCII_ART}`,
    'color: red; font-family: monospace; font-size: 11px; font-weight: bold; line-height: 1.2;'
  );
}

/**
 * Injects a hidden warning node at the beginning of the body tag.
 * This element is intended to be visible to users inspecting the DOM in the Elements tab.
 */
export function showElementsWarning(): void {
  if (typeof document === 'undefined' || !document.body) return;

  // 1. Ensure the div warning is there and has correct content
  let warningNode = document.getElementById(WARNING_ID);
  if (!warningNode) {
    warningNode = document.createElement('div');
    warningNode.id = WARNING_ID;
    warningNode.setAttribute('style', 'display: none;');
  }

  // Ensure the <pre> tag containing ASCII Art exists inside the div
  const expectedHTML = `<pre style="font-family: monospace; white-space: pre; line-height: 1.2;">\n${ASCII_ART}</pre>`;
  if (warningNode.innerHTML !== expectedHTML) {
    warningNode.innerHTML = expectedHTML;
  }

  // 2. Manage the single comment node for immediate visibility in Elements tab
  const commentText = getWarningCommentText();
  const childNodes = Array.from(document.body.childNodes);
  
  // Look for our comment node
  let ourCommentNode: Comment | null = null;
  for (const node of childNodes) {
    if (node.nodeType === Node.COMMENT_NODE && node.nodeValue === commentText) {
      ourCommentNode = node as Comment;
      break;
    }
  }

  // Check if our comment is the very first child of the body, and the warningNode is the second child
  const firstChild = document.body.firstChild;
  const secondChild = firstChild ? firstChild.nextSibling : null;

  const isCommentFirst = firstChild === ourCommentNode;
  const isDivSecond = secondChild === warningNode;

  if (!isCommentFirst || !isDivSecond) {
    // Remove all existing copies of our comment from the body to prevent duplicates
    for (const node of childNodes) {
      if (node.nodeType === Node.COMMENT_NODE && node.nodeValue === commentText) {
        document.body.removeChild(node);
      }
    }
    
    // Also detach warningNode temporarily if it is already in the body
    if (warningNode.parentNode === document.body) {
      document.body.removeChild(warningNode);
    }

    // Now insert them in correct order: warningNode first, then prepend the comment node
    const newCommentNode = document.createComment(commentText);
    document.body.prepend(warningNode);
    document.body.prepend(newCommentNode);
  }
}

/**
 * Removes the warning node and comment nodes from the DOM.
 */
export function hideElementsWarning(): void {
  if (typeof document === 'undefined') return;

  const warningNode = document.getElementById(WARNING_ID);
  if (warningNode && warningNode.parentNode) {
    warningNode.parentNode.removeChild(warningNode);
  }

  if (document.body) {
    const commentText = getWarningCommentText();
    const childNodes = Array.from(document.body.childNodes);
    for (const node of childNodes) {
      if (node.nodeType === Node.COMMENT_NODE && node.nodeValue === commentText) {
        document.body.removeChild(node);
      }
    }
  }
}

/**
 * Starts observing body modifications to ensure the warning element is not deleted or moved.
 */
const startObserving = (checkDevToolsStatus: () => boolean): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !document.body) return;

  if (observer) {
    observer.disconnect();
  }

  const observeOptions = { childList: true, subtree: false };

  observer = new MutationObserver(() => {
    if (checkDevToolsStatus()) {
      const warningNode = document.getElementById(WARNING_ID);
      const commentText = getWarningCommentText();
      const firstChild = document.body.firstChild;
      const secondChild = firstChild ? firstChild.nextSibling : null;

      const isCommentFirst = firstChild && firstChild.nodeType === Node.COMMENT_NODE && firstChild.nodeValue === commentText;
      const isDivSecond = secondChild === warningNode;

      if (!isCommentFirst || !isDivSecond) {
        // Disconnect observer before making DOM changes to prevent infinite recursion
        observer?.disconnect();
        showElementsWarning();
        // Re-observe
        if (observer && document.body) {
          observer.observe(document.body, observeOptions);
        }
      }
    }
  });

  observer.observe(document.body, observeOptions);
};

/**
 * Stops observing body modifications.
 */
const stopObserving = (): void => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};

/**
 * Initializes DevTools protection with custom options.
 * Returns a cleanup function to stop monitoring and remove DOM modifications.
 */
export function initDevToolsProtection(config?: DevToolsProtectionConfig): () => void {
  // SSR Safety check
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  if (!mergedConfig.enabled) {
    return () => {};
  }

  let wasOpen = false;
  let intervalId: any = null;

  const check = (): boolean => {
    // Detect DevTools based on difference between outer and inner window dimensions
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    const isOpen = widthDiff > mergedConfig.threshold || heightDiff > mergedConfig.threshold;

    if (isOpen) {
      if (!wasOpen) {
        wasOpen = true;

        if (mergedConfig.showConsoleWarning) {
          showConsoleWarning();
        }

        if (mergedConfig.showElementsWarning) {
          showElementsWarning();
        }
      } else {
        // Keep checking and ensuring the element stays prepended if someone tried to bypass it
        if (mergedConfig.showElementsWarning) {
          const warningNode = document.getElementById(WARNING_ID);
          if (!warningNode || document.body.firstChild !== warningNode) {
            showElementsWarning();
          }
        }
      }
    } else {
      if (wasOpen) {
        wasOpen = false;
        if (mergedConfig.showElementsWarning && mergedConfig.removeElementWhenClosed) {
          hideElementsWarning();
        }
      }
    }

    return isOpen;
  };

  if (mergedConfig.showElementsWarning) {
    startObserving(check);
  }

  // Initial check on load
  check();

  // Polling check interval
  intervalId = setInterval(check, mergedConfig.intervalMs);

  // Return the cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    stopObserving();
    if (mergedConfig.showElementsWarning) {
      hideElementsWarning();
    }
  };
}
```

---

## 3. Từng bước tích hợp vào Dự án

### Bước 3.1. Tích hợp vào Web App (Next.js App Router)

Được tích hợp vào file layout gốc chạy ở phía client của Web App để bảo vệ toàn bộ các trang công khai.

1. **File tích hợp:** [apps/web/app/layout.tsx](file:///d:/HUIT_PROJECT/Contest%20Voting%20Platform/Contest-Voting-Platform/apps/web/app/layout.tsx)
2. **Cách viết:**
   ```tsx
   'use client';

   import React, { useEffect } from 'react';
   import { initDevToolsProtection } from '../src/utils/devtoolsProtection';

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     useEffect(() => {
       // Khởi chạy cơ chế phát hiện DevTools và nhận về hàm dọn dẹp
       const cleanup = initDevToolsProtection();
       return cleanup; // Tự động dọn dẹp khi layout unmount
     }, []);

     return (
       <html lang="vi">
         <body>{children}</body>
       </html>
     );
   }
   ```

### Bước 3.2. Tích hợp vào Admin App (Next.js Admin Dashboard)

Được tích hợp vào phần vỏ bọc client của Admin Dashboard để bảo vệ các trang quản trị.

1. **File tích hợp:** [apps/admin/app/ClientShell.tsx](file:///d:/HUIT_PROJECT/Contest%20Voting%20Platform/Contest-Voting-Platform/apps/admin/app/ClientShell.tsx)
2. **Cách viết:**
   ```tsx
   'use client';

   import React, { useEffect } from 'react';
   import { initDevToolsProtection } from '../src/utils/devtoolsProtection';

   export default function ClientShell({ children }: { children: React.ReactNode }) {
     useEffect(() => {
       const cleanup = initDevToolsProtection();
       return cleanup;
     }, []);

     return <>{children}</>;
   }
   ```

---

## 4. Các lưu ý quan trọng về thiết kế hiển thị

### 4.1. Chiều rộng tối đa của ASCII Art
Để tránh việc các khối chữ nghệ thuật bị tự động xuống dòng (wrap) làm méo mó cấu trúc khi cửa sổ DevTools của người dùng quá nhỏ, kích thước của chữ đã được khống chế chặt chẽ:
- Khối chữ **`DUNG LAI !!!`**: Rộng tối đa **73 ký tự**.
- Khối chữ **`HUIT MEDIA`**: Rộng tối đa **71 ký tự** (bao gồm đầy đủ chân khối của chữ `E` và chữ `A`).
- **Gợi ý:** Không nên tăng chiều rộng của các ký tự này vượt quá 75 ký tự để đảm bảo hiển thị tốt nhất trên mọi kích thước màn hình.

### 4.2. Tránh trùng lặp trên React Hydration
Tính năng bảo vệ DOM sử dụng các thao tác trực tiếp (`document.body.prepend`) bên trong hook `useEffect` nên nó chỉ hoạt động hoàn toàn ở Client-side, không ảnh hưởng hay làm lệch pha quá trình Render phía Máy chủ (SSR - Server-Side Rendering) hoặc quá trình Hydration của React/Next.js.

---

## 5. Kiểm tra và Gỡ lỗi

1. Để tắt tạm thời tính năng bảo vệ này trong môi trường phát triển cục bộ nếu cần thiết, bạn có thể truyền cấu hình `enabled: false` hoặc kiểm tra môi trường:
   ```typescript
   initDevToolsProtection({
     enabled: process.env.NODE_ENV !== 'development'
   });
   ```
2. Hãy đảm bảo phông chữ hiển thị trong DevTools của bạn được đặt là phông chữ đơn cách (Monospace) như `Consolas`, `Courier New` hoặc `SFMono-Regular` để các khối chữ Unicode xếp chồng thẳng hàng hoàn hảo.
