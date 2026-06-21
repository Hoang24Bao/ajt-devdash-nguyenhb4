import { Product } from './types';

// 1. Định nghĩa các trạng thái riêng biệt với thẻ phân biệt
interface IdleState {
  status: 'idle';
}

interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: Product[];
}

interface ErrorState {
  status: 'error';
  message: string; 
}

// 2. Gộp lại thành kiểu hợp có gắn thẻ phân biệt (Discriminated Union)
export type AppState = IdleState | LoadingState | SuccessState | ErrorState;

export interface ApplicationStateManager {
  currentState: AppState;
}

// 3. Khởi tạo trạng thái ban đầu 'idle'
export const appState: ApplicationStateManager = {
  currentState: { status: 'idle' }
};