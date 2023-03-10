import React, { useState, useEffect } from "react"
import axios from "axios"
import { ResponsiveBar } from "@nivo/bar"

function BarChartDoneWorksforThisWeek() {
  const [works, setWork] = useState([])
  const [todayWorkCount, setTodayWorkCount] = useState(0)

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const today = new Date()
  const dayOfWeek = today.getDay()
  const hour = today.getHours()

  const daysSinceSunday = today.getDay()
  const lastSunday = new Date(today)
  lastSunday.setDate(today.getDate() - daysSinceSunday - 7)
  const lastSaturday = new Date(today)
  lastSaturday.setDate(today.getDate() - daysSinceSunday - 1)
  const thisSunday = new Date(today)
  thisSunday.setDate(today.getDate() - daysSinceSunday)
  const thisSaturday = new Date(today)
  thisSaturday.setDate(today.getDate() - daysSinceSunday + 6)

  const lastSundayStr = `${lastSunday.getFullYear()}${(
    lastSunday.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${lastSunday.getDate().toString().padStart(2, "0")}`
  const lastSaturdayStr = `${lastSaturday.getFullYear()}${(
    lastSaturday.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${lastSaturday.getDate().toString().padStart(2, "0")}`
  const thisSundayStr = `${thisSunday.getFullYear()}${(
    thisSunday.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${thisSunday.getDate().toString().padStart(2, "0")}`
  const thisSaturdayStr = `${thisSaturday.getFullYear()}${(
    thisSaturday.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${thisSaturday.getDate().toString().padStart(2, "0")}`

  useEffect(function () {
    if (dayOfWeek === 0 && hour <= 4) {
      setStartDate(() => lastSundayStr)
      setEndDate(() => lastSaturdayStr)
    } else {
      setStartDate(() => thisSundayStr)
      setEndDate(() => thisSaturdayStr)
    }
  })

  useEffect(() => {
    if (startDate && endDate) {
      const fetchWork = async () => {
        try {
          axios
            .get(
              `https://i8a105.p.ssafy.io/api/v1/data/mypage/done-works-dates/${startDate}/${endDate}`,
              {}
            )
            .then((result1) => {
              setWork(processData(result1.data))
            })
            .catch((error) => {})

          axios
            .get(
              "https://i8a105.p.ssafy.io/api/v1/data/mypage/done-works-cnt/today",
              {}
            )
            .then((result2) => {
              setTodayWorkCount(result2.data)
            })
            .catch((error) => {})
        } catch (error) {}
      }

      fetchWork()
    }
  }, [todayWorkCount, startDate, endDate])

  const todaysdayOfWeek = today.toLocaleDateString("en-US", {
    weekday: "short",
  })

  const processData = (data) => {
    const counts = data.reduce((accumulator, current) => {
      const date = new Date(current.dateFinished)
      const dayOfTheWeek = date.toLocaleDateString("en-US", {
        weekday: "short",
      })
      accumulator[dayOfTheWeek] = accumulator[dayOfTheWeek] || 0
      accumulator[dayOfTheWeek] += 1
      return accumulator
    }, {})

    const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return daysOfTheWeek.map((dayOfTheWeek) => ({
      dayOfTheWeek,
      count:
        dayOfTheWeek === todaysdayOfWeek
          ? todayWorkCount
          : counts[dayOfTheWeek] || 0,
    }))
  }

  const handle = {
    barClick: (data) => {},

    legendClick: (data) => {},
  }

  return (
    // chart height??? 100%?????? ????????? chart??? ?????? ????????? ????????? height ??????
    <div
      style={{
        width: "800px",
        height: "500px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {works.some((e) => e.count >= 1) ? (
        <ResponsiveBar
          /**
           * chart??? ????????? ?????????
           */
          data={works}
          /**
           * chart??? ????????? ????????? key (???????????? ???)
           */
          keys={["count"]}
          /**
           * keys?????? ??????????????? index key (???????????? ???)
           */
          indexBy="dayOfTheWeek"
          /**
           * chart margin
           */
          margin={{ top: 50, left: 130, right: 130, bottom: 70 }}
          /**
           * chart padding (bar??? ??????)
           */
          padding={0.3}
          /**
           * chart ??????
           */
          //colors={['olive', 'brown', 'orange']} // ??????????????? ????????? ???
          colors={{ scheme: "pastel2" }} // nivo?????? ??????????????? ?????? ?????? ????????? ???
          /**
           * color ?????? ??????
           */
          colorBy="id" // ????????? keys ???????????? ?????? ??????
          // colorBy="indexValue" // indexBy??? ?????? ??????????????? ?????? ??????
          theme={{
            /**
             * label style (bar??? ???????????? ??????)
             */
            labels: {
              text: {
                fontSize: 14,
                fill: "#000000",
              },
            },
            /**
             * legend style (default??? ?????? ????????? ?????? ????????? key ??????)
             */
            legends: {
              text: {
                fontSize: 12,
                fill: "#000000",
              },
            },
            axis: {
              /**
               * axis legend style (bottom, left??? ?????? ??????)
               */
              legend: {
                text: {
                  fontSize: 15,
                  fill: "white",
                },
              },
              /**
               * axis ticks style (bottom, left??? ?????? ???)
               */
              ticks: {
                text: {
                  fontSize: 16,
                  fill: "white",
                },
              },
            },
          }}
          /**
           * axis bottom ??????
           */
          axisBottom={{
            tickSize: 5, // ??? ???????????? ?????? ??????????????? ??? ??????
            tickPadding: 5, // tick padding
            tickRotation: 0, // tick ?????????
            legend: "??????", // bottom ??????
            legendPosition: "middle", // ?????? ??????
            legendOffset: 50, // ????????? chart??? ??????
          }}
          /**
           * axis left ??????
           */
          axisLeft={{
            tickSize: 5, // ??? ???????????? ?????? ??????????????? ??? ??????
            tickPadding: 5, // tick padding
            tickRotation: 0, // tick ?????????
            legend: "?????? ???", // left ??????
            legendPosition: "middle", // ?????? ??????
            legendOffset: -70, // ????????? chart??? ??????
          }}
          /**
           * label ???????????? ??? ?????? width
           */
          labelSkipWidth={36}
          /**
           * label ???????????? ??? ?????? height
           */
          labelSkipHeight={12}
          /**
           * bar ?????? ?????????
           */
          onClick={handle.barClick}
          /**
           * legend ?????? (default??? ?????? ????????? ?????? ????????? key ??????)
           */
          legends={[]}
        />
      ) : (
        <div style={{ color: "white", fontSize: "2rem" }}>
          ?????? ???????????? ????????????{" "}
        </div>
      )}
    </div>
  )
}

export default BarChartDoneWorksforThisWeek
