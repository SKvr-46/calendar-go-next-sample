package main

import (
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Schedule struct {
	ID 			int `json:"id"`
	Year		int `json:"year"`
	Month		int `json:"month"`
	Date        int `json:"date"`	
	Title		string `json:"title"`
	Content 	string `json:"content"`
}

func main() {
	app := fiber.New()

	schedules := []Schedule{}

	//CORS設定
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/api/schedules", func(c *fiber.Ctx) error {
		return c.JSON(schedules)
	})

	app.Get("/api/schedules/:year/:month/:date", func(c *fiber.Ctx) error {
		schedule := []Schedule{} //部分的な予定を格納する配列
		year, year_err := c.ParamsInt("year")
		month, month_err := c.ParamsInt("month")
		date, date_err := c.ParamsInt("date")

		if year_err != nil {
			log.Println(year_err)
			return c.SendString("year param error")
		}
		if month_err != nil {
			log.Println(month_err)
			return c.SendString("month param error")
		}
		if date_err != nil {
			log.Println(date_err)
			return c.SendString("date param error")
		}
		//一致する年月日でスケジュールを取得
		for i, t := range schedules {
			if t.Year == year && t.Month == month && t.Date == date {
						schedule = append(schedule, schedules[i])
		}
		}
		return c.JSON(schedule)
	})

	app.Post("/api/schedules", func(c *fiber.Ctx) error {
		schedule := &Schedule{}
		if err := c.BodyParser(schedule); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request payload",
			})
		}
		schedules = append(schedules, *schedule)
		return c.JSON(schedules)
	})

	app.Delete("/api/schedules/:year/:month/:date/:id/delete", func(c *fiber.Ctx) error {
		year, year_err := c.ParamsInt("year")
		month, month_err := c.ParamsInt("month")
		date, date_err := c.ParamsInt("date")
		id, id_err := c.ParamsInt("id")

		if year_err != nil {
			log.Println(year_err)
			return c.SendString("year param error")
		}
		if month_err != nil {
			log.Println(month_err)
			return c.SendString("month param error")
		}
		if date_err != nil {
			log.Println(date_err)
			return c.SendString("date param error")
		}
		if id_err!= nil {
			log.Println(id_err)
            return c.SendString("id param error")
        }

		//一致する年月日でスケジュールを取得
		for i, t := range schedules {
			if t.Year == year && t.Month == month && t.Date == date && t.ID == id {
				schedules = append(schedules[:i], schedules[i+1:]...)
				break
			} else {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Invalid request payload",
				})
			}
		}
	return c.JSON(schedules)
	})

	if err := app.Listen(":4000"); err != nil {
		log.Println(err)
	}
}