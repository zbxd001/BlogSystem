import Vue from 'vue'
import router from '@/router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'
import {
    loginAPI,
    registerAPI,
    getUserInfoAPI,
    getUserArticleAPI,
    updateUserInfoAPI,
    makeCommentAPI,
} from '@/api/user'
import {
    addArticleAPI,
    updateArticleAPI
} from "@/api/article"
const getDefaultState = () => {
    return {
        updateUserInfoModalVisible: false,
        userId: '',
        userInfo: {

        },
        userArticleList: [

        ],
        userCommentList: [

        ],
        token: '',
        articleNeedModify: false,
        articleFormNeedModify: {}
    }
}

const user = {
    state: getDefaultState(),

    mutations: {
        reset_state: function (state) {
            state.token = '',
                state.userId = '',
                state.userInfo = {

                },
                state.userBlogList = [],
                state.userCommentList = [],
                articleNeedModify = false,
                articleFormNeedModify = {}
        },
        set_token: (state, data) => {
            state.token = data
        },
        set_email: (state, data) => {
            state.email = data
        },
        set_userId: (state, data) => {
            state.userId = data
        },
        set_userInfo: (state, data) => {
            state.userInfo = {
                ...state.userInfo,
                ...data
            }
        },
        set_userArticleList: (state, data) => {
            state.userArticleList = data
        },
        set_userCommentList: (state, data) => {
            state.userCommentList = {
                ...state.userCommentList,
                ...data
            }
        },
        set_updateUserInfoModalVisible: function (state, data) {
            state.updateUserInfoModalVisible = data
        },
        set_articleNeedModify: (state, data) => {
            state.articleNeedModify = data;
        },
        set_articleFormNeedModify:(state,data)=>{
            state.articleFormNeedModify = data;
        }
    },

    actions: {
        login: async ({ state, dispatch, commit }, userData) => {
            const res = await loginAPI(userData)
            console.log("?????????????????????")
            console.log(res)
            if (res) {
                setToken(res.id)
                commit('set_userId', res.id)
                commit('set_token', res.id)
                dispatch('getUserInfo').then(() => {
                    if (state.userInfo.userType === 'Admin') {
                        router.push({ name: 'Admin' })
                    } else {
                        router.push({ name: "BlogHome" })
                    }
                })
                Message.success("????????????")
                dispatch('getUserArticle')
            } else {
                Message.error("????????????")
            }
        },
        register: async ({ commit }, data) => {
            const res = await registerAPI(data)
            console.log(res)
            if (res) {
                Message.success('????????????')
            }
        },
        getUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
                getUserInfoAPI(state.userId).then(response => {
                    const data = response
                    if (!data) {
                        reject('?????????????????????????????????')
                    }
                    console.log(data)
                    commit('set_userInfo', data)
                    commit('set_userId', data.id)
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getUserArticle: async ({ state, commit }) => {
            const res = await getUserArticleAPI(state.userId)
            if (res) {
                commit('set_userArticleList', res)
                console.log('????????????????????????', res)
            }
        },
        updateUserInfo: async ({ state, dispatch }, data) => {
            const params = {
                id: state.userId,
                ...data,
            }
            const res = await updateUserInfoAPI(params)
            if (res) {
                Message.success('????????????')
                dispatch('getUserInfo')
            }
        },
        logout: async ({ commit }) => {
            removeToken()
            resetRouter()
            commit('reset_state')
        },
        // remove token
        resetToken({ commit }) {
            return new Promise(resolve => {
                removeToken() // must remove  token  first
                commit('reset_state')
                resolve()
            })
        },
        addArticle: async ({ state, dispatch }, data) => {
            const res = await addArticleAPI(data);
            if (res) {
                dispatch("getUserArticle");
                Message.success("??????????????????");
                router.push({ name: "BlogHome" });
            }
        },
        addComment: async ({ state, dispatch }, data) => {
            const res = await makeCommentAPI(state.userId, data);
            if (res) {
                dispatch("getUserArticle");
                Message.success("??????????????????");
            }
        },
        modifyArticle:async ({ state, dispatch },data) => {
            const res = await updateArticleAPI(data);
            if (res) {
                dispatch("getUserArticle");
                Message.success("??????????????????");
                router.push({ name: "BlogHome" });
            }
        },
    }
}

export default user