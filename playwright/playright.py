import asyncio
import json

from playwright.async_api import Browser, Request, async_playwright, expect


async def print_json_response(response: Request):
    content_type = response.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            json_data = await response.json()
            print("<<", response.status, response.url, json_data)
        except json.JSONDecodeError:
            print("<<", response.status, response.url, "JSON decode error")
    else:
        print("<<", response.status, response.url, "Response is not JSON")


async def worker(browser: Browser, user: dict) -> None:
    context = await browser.new_context(viewport={"width": 1920, "height": 1080})
    page = await context.new_page()
    page.on("request", lambda request: print(">>", request.method, request.url))
    page.on("response", print_json_response)

    # for user in list_user:
    await page.goto("")
    await page.locator("#root > div > div:nth-child(2) > div").click()
    await page.get_by_label("ログイン名／メールアドレス＊").click()
    await page.get_by_label("ログイン名／メールアドレス＊").fill(user["username"])
    await page.get_by_label("パスワード＊").click()
    await page.get_by_label("パスワード＊").fill(user["password"])
    await page.get_by_role("button", name="ログイン").click()
    await page.locator(".ant-notification-notice-close").click()
    await expect(page.locator(".loading-icon")).to_be_hidden()
    await page.screenshot(path=f"screenshot{user['username']}.png", full_page=True)
    await page.locator("a").filter(has_text=user["username"]).click()
    await page.get_by_text("ログアウト").click()

    # ---------------------
    await context.close()
    # await browser.close()


async def main() -> None:
    list_user = [
        {"username": "username", "password": "password"},
        {"username": "username", "password": "password"},
    ]
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            executable_path="C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            headless=False,
            channel="chrome",
            args=["--start-fullscreen"],
        )
        await asyncio.wait(
            [asyncio.create_task(worker(browser, user)) for user in list_user],
            return_when=asyncio.ALL_COMPLETED,
        )
        await browser.close()


asyncio.run(main())
