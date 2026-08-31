import { create } from 'zustand';

// 1. Define the TypeScript interface for your state and actions
interface UnsavedChangesState {
    hasUnsavedChanges: boolean
    setHasUnsavedChanges: (s: boolean) => void
}



export const useHasUnsavedChangesStore =
    create<UnsavedChangesState>((set) => ({
        hasUnsavedChanges: false,
        setHasUnsavedChanges: (newValue: boolean) => set(() => ({ hasUnsavedChanges: newValue })),
    }))



// 1. Define the TypeScript interface for your state and actions
// interface HasUnsavedChangesState {
//     hasUnsavedChanges: boolean
//     setHasUnsavedChanges: (updater: (newState: boolean) => boolean) => void
//     actionThatNeedsState: () => boolean

// }



// export const useHasUnsavedChangesStore =
//     create<HasUnsavedChangesState>()((set, get) => ({
//         hasUnsavedChanges: false,
//         setHasUnsavedChanges: () => (newState: boolean) =>
//             set(() => ({ hasUnsavedChanges: newState })),
//         actionThatNeedsState: () => {
//             const currentBears = get().hasUnsavedChanges

//             console.log('currentBears', currentBears)
//             return currentBears;
//         }
//     }));