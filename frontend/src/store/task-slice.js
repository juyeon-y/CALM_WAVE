import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { selectedTaskActions } from "./door-store/selected-task-slice"

const initialState = {
  onProgress: false,
  taskList: [
    // {
    //   id:1,
    //   title: "집가기",
    //   description: "집가서 할게요",
    //   createdDate: "2023-02-09",
    //   finishedDate: "2023-02-11",
    //   categoryId: "1",
    // },
    // {
    //   id:2,
    //   title: "집가기",
    //   description: "집가서 할게요",
    //   createdDate: "2023-02-09",
    //   finishedDate: "2023-02-12",
    //   categoryId: "1",
    // },
    // {
    //   id:3,
    //   title: "집가기",
    //   description: "집가서 할게요",
    //   createdDate: "2023-02-09",
    //   finishedDate: "2023-02-09",
    //   categoryId: "1",
    // },
    // {
    //   id:4,
    //   title: "테스트",
    //   description: "디데이테스트..",
    //   createdDate: "2023-02-01",
    //   finishedDate: "2023-02-15",
    //   categoryId: "1",
    // },
    // {
    //   id:5,
    //   title: "테스트",
    //   description: "디데이테스트..",
    //   createdDate: "2023-01-30",
    //   finishedDate: "2023-02-20",
    //   categoryId: "1",
    // },
    // {
    //   id:6,
    //   title: "테스트",
    //   description: "디데이테스트..",
    //   createdDate: "2023-02-10",
    //   finishedDate: "2023-02-11",
    //   categoryId: "1",
    // },
    // {
    //   id:7,
    //   title: "테스트",
    //   description: "디데이테스트..",
    //   createdDate: "2023-02-10",
    //   finishedDate: "2023-02-12",
    //   categoryId: "1",
    // },
  ],
}

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setProgress(state, action) {
      state.onProgress = action.payload
    },
    changeTaskList(state, action) {
      state.taskList = action.payload
    },
    deleteTask(state, action) {
      const id = action.payload
      state.taskList = state.taskList.filter((todo) => todo.id !== id)
    },
    pushTaskList(state, action) {
      state.taskList = [...state.taskList, ...action.payload]
    },
  },
})

export const AxiosGetTodos = function () {
  return async function (dispatch) {
    axios({
      method: "get",
      url: `/v1/task/todo`,
    })
      .then((res) => {
        // console.log(res, "TODO")
        dispatch(
          taskActions.changeTaskList(
            res.data.map((task) => {
              return {
                id: task?.id,
                title: task?.title,
                description: task?.description,
                category: task?.workCate,
                categoryId: task?.workCate?.cateId,
                createdDate: task?.dateCreated,
                isSelected: false,
                column:
                  task?.status === "TODO"
                    ? "To do"
                    : task?.status === "DONE"
                    ? "Done"
                    : task?.status,
                finishedDate: task?.dateAimed,
                time: task?.totalTime,
                workOrder: task?.workOrder,
                storyPoint: task?.timeAimed,
              }
            })
          )
        )
      })
      .then(async () => {
        axios({
          method: "get",
          url: `/v1/task/done`,
        }).then((res) => {
          // console.log(res, "DONE")
          dispatch(
            taskActions.pushTaskList(
              res.data.map((task) => {
                return {
                  id: task.id,
                  title: task?.title,
                  description: task?.description,
                  category: task?.workCate,
                  categoryId: task?.workCate?.cateId,
                  createdDate: task?.dateCreated,
                  isSelected: false,
                  column: task?.status === "TODO" ? "To do" : "Done",
                  finishedDate: task?.dateAimed,
                  time: task?.totalTime || 0,
                  workOrder: task?.workOrder,
                  startWorkingDate: "",
                  endWorkingDate: "",
                  storyPoint: task?.timeAimed,
                }
              })
            )
          )
        })
      })
      .then(() => {
        dispatch(selectedTaskActions.recallSelectedTodoTaskList())
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export const taskActions = taskSlice.actions
export default taskSlice.reducer
