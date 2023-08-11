import {create} from "zustand"
import {devtools} from "zustand/middleware"
import API from "../api/api.ts"
import {ListCategoryDto} from "../api/dto.ts"

interface CategoryStore {
    isLoading: boolean
    loadedDetails: string | null
    errorDetails: string | null
    categories: ListCategoryDto[]
    fetchCategories: () => Promise<void>
    createCategory: (name: string, color: string) => Promise<void>
    updateCategory: (id: string, name: string, color: string) => Promise<void>
    deleteCategory: (id: string) => Promise<void>
}

const useCategoryStore = create<CategoryStore>()(
    devtools(
        (set, get) => ({
            isLoading: false,
            loadedDetails: null,
            errorDetails: null,
            categories: [],
            fetchCategories: async () => {
                set((state) => ({...state, isLoading: true}))

                try {
                    const categories = await API.categories.getAll()

                    set((state) => ({
                        ...state,
                        categories: categories,
                        loadedDetails: null,
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to fetch categories",
                        isLoading: false
                    }))
                }
            },
            createCategory: async (name: string, color: string) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.categories.post({
                        name: name,
                        color: color
                    })

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully created new category",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to create new category",
                        isLoading: false
                    }))
                }

                await get().fetchCategories()
            },
            updateCategory: async (id: string, name: string, color: string) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.categories.patch(id,{
                        name: name,
                        color: color
                    })

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully updated category",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to update category",
                        isLoading: false
                    }))
                }

                await get().fetchCategories()
            },
            deleteCategory: async (id: string) => {
                set((state) => ({...state, isLoading: true}))

                try {
                    await API.categories.delete(id)

                    set((state) => ({
                        ...state,
                        loadedDetails: "Successfully deleted category",
                        errorDetails: null,
                        isLoading: false
                    }))
                } catch (err) {
                    set((state) => ({
                        ...state,
                        loadedDetails: null,
                        errorDetails: "Failed to delete category",
                        isLoading: false
                    }))
                }

                await get().fetchCategories()
            },
        })
    )
)

export default useCategoryStore
