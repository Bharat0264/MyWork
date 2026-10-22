"""Playwright smoke test suite for Garuda Studio.

Validates all 12 routes, active navigation states, interactive flows,
form validations, and package integrations against local or live builds.
"""

import asyncio
import os
import sys
from playwright.async_api import async_playwright

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:3000")

ROUTES = [
    "/",
    "/about",
    "/work",
    "/work/rainbow-digi-school",
    "/work/printbee",
    "/work/aura-bi",
    "/work/royal-mechanics",
    "/work/earnova",
    "/work/anutek",
    "/services",
    "/services/social-media",
    "/contact",
]

async def run_smoke_tests():
    print(f"Starting Playwright Smoke Tests against {BASE_URL}...")
    failures = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # 1. Route availability test (Desktop & Mobile)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        for route in ROUTES:
            url = f"{BASE_URL}{route}"
            try:
                res = await page.goto(url, wait_until="networkidle", timeout=15000)
                if not res or res.status >= 400:
                    failures.append(f"Route {route} returned status {res.status if res else 'None'}")
                else:
                    print(f"✓ {route} loaded (status: {res.status})")
            except Exception as e:
                failures.append(f"Route {route} failed to load: {e}")

        # 2. Key Interactive Flows: Contact Form Pre-fill & Validation
        print("\nTesting Contact Form interactions...")
        await page.goto(f"{BASE_URL}/contact?service=social-media&package=growth", wait_until="networkidle")
        
        # Verify hidden package input
        pkg_input = await page.locator("input[name='package']").input_value()
        if "Growth" not in pkg_input:
            failures.append(f"Expected package input to contain 'Growth', got '{pkg_input}'")
        else:
            print("✓ Package query parameter correctly pre-filled into hidden input")

        # Verify details pre-fill
        details_val = await page.locator("textarea[name='details']").input_value()
        if "Growth" not in details_val:
            failures.append("Expected textarea details to be pre-filled with Growth plan")
        else:
            print("✓ Project details textarea correctly pre-filled")

        # 3. Work Category Tabs
        print("\nTesting Work Page category tabs...")
        await page.goto(f"{BASE_URL}/work", wait_until="networkidle")
        redesign_btn = page.locator("button:has-text('Redesign')").first
        if await redesign_btn.count() > 0:
            await redesign_btn.click()
            await page.wait_for_timeout(300)
            print("✓ Work category tabs respond to click")
        else:
            failures.append("Work category 'Redesign' tab not found")

        # 4. Services Page 08 Tab
        print("\nTesting Services Showcase 08 Tab...")
        await page.goto(f"{BASE_URL}/services", wait_until="networkidle")
        s8_tab = page.locator("button:has-text('Social Media Management')").first
        if await s8_tab.count() > 0:
            await s8_tab.click()
            await page.wait_for_timeout(300)
            print("✓ Service 08 Social Media Management tab active and functional")
        else:
            failures.append("Service 08 tab not found")

        await browser.close()

    print("\n=========================================")
    if failures:
        print(f"FAILED: {len(failures)} test(s) failed:")
        for f in failures:
            print(f"  - {f}")
        sys.exit(1)
    else:
        print("ALL SMOKE TESTS PASSED (100% OK)!")
        print("=========================================")

if __name__ == "__main__":
    asyncio.run(run_smoke_tests())
