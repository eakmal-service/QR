import { LeLoLogo } from "./lelo-logo"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/20 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <LeLoLogo className="mb-4" />
            <p className="text-muted-foreground mb-4 max-w-md">
              Empowering businesses with cutting-edge AI review solutions. Take control of your success with QR.Akmal.
            </p>
            <p className="text-sm text-muted-foreground/70 italic">"Boost your reputation, one scan at a time"</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li className="pt-2">
                <a href="mailto:support@akmal.in" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <span className="text-muted-foreground">Email:</span> support@akmal.in
                </a>
              </li>
              <li>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Phone / WhatsApp:</span>
                  <div className="flex gap-3">
                    <a href="tel:+917600009818" className="hover:text-foreground transition-colors">
                      +91 7600009818
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 QR.Akmal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
