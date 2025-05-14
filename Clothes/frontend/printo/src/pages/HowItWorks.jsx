import { ArrowRight, Palette, ShoppingBag, Truck, Shirt, MousePointerClick, HeartHandshake } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Choose Your Product",
      description: "Browse our collection of high-quality clothing items and select your favorite piece.",
      icon: Shirt,
    },
    {
      title: "Customize Design",
      description: "Use our intuitive design tool to create your unique customization - add text, images, or choose from our templates.",
      icon: Palette,
    },
    {
      title: "Preview & Personalize",
      description: "See your design come to life with our real-time preview. Adjust colors, sizes, and placement until it's perfect.",
      icon: MousePointerClick,
    },
    {
      title: "Add to Cart",
      description: "Once you're happy with your design, add it to your cart. You can order multiple items with the same design.",
      icon: ShoppingBag,
    },
    {
      title: "Fast Delivery",
      description: "We carefully print and package your custom order and deliver it right to your doorstep.",
      icon: Truck,
    },
    {
      title: "Satisfaction Guaranteed",
      description: "Love your custom creation or we'll make it right. Your satisfaction is our top priority.",
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Creating your perfect custom clothing is easy with our simple step-by-step process
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mb-4">
              <step.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
            
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-indigo-300">
                <ArrowRight className="w-8 h-8" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <a
          href="/products"
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Start Creating
          <ArrowRight className="ml-2 w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
