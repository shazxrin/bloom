import {CategoryControllerApi, ListCategoryDto} from "../api";
import {create} from "zustand";
import {devtools} from "zustand/middleware";

interface CategoryStore {
    isLoading: boolean
    categories: ListCategoryDto[]
    fetchCategories: () => void
    createCategory: (name: string, color: string) => void
}

export const useCategoryStore = create<CategoryStore>()(
    devtools(
        (set, get) => ({
            isLoading: false,
            categories: [],
            fetchCategories: async () => {
                set((state) => ({...state, isLoading: true}))

                const categoriesApi = new CategoryControllerApi()
                const response = await categoriesApi.getAllCategories()

                if (response.status == 200) {
                    set((state) => ({...state, categories: response.data, isLoading: false}))
                } else {
                    set((state) => ({...state, isLoading: false}))
                }
            },
            createCategory: async (name: string, color: string) => {
                set((state) => ({...state, isLoading: true}))

                const categoriesApi = new CategoryControllerApi()
                const response = await categoriesApi.postCreateCategory({
                    createCategoryDto: {
                        name: name,
                        color: color
                    }
                })

                if (response.status == 201) {
                    set((state) => ({...state, isLoading: false}))
                } else {
                    set((state) => ({...state, isLoading: false}))
                }

                get().fetchCategories()
            }
        })
    )
)
