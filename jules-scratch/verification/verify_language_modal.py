from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000")

    # Click on the language selection button
    page.get_by_role("button", name="Français").click()

    # Wait for the modal to appear
    expect(page.get_by_role("dialog")).to_be_visible()

    # Take a screenshot of the modal
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
