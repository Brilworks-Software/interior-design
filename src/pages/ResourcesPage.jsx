import { useParams } from "react-router-dom";

const RESOURCES = {
  "design-guide": {
    title: "Design Guide",
    description:
      "Professional tips and tricks for creating stunning interior designs",
    content: `
      <h2>Design Guide</h2>
      <p>Learn the fundamentals of interior design:</p>
      <ul>
        <li><strong>Color Theory:</strong> Understanding how colors interact and create mood</li>
        <li><strong>Space Planning:</strong> Maximizing your room layout for functionality</li>
        <li><strong>Lighting:</strong> Creating ambiance with proper lighting techniques</li>
        <li><strong>Proportions:</strong> Using the golden ratio for balanced designs</li>
        <li><strong>Texture and Materials:</strong> Choosing the right finishes and fabrics</li>
      </ul>
      <p>Our 3D designer helps you visualize these concepts in real-time!</p>
    `,
  },
  furniture: {
    title: "Furniture Library",
    description: "Browse our extensive collection of 3D furniture models",
    content: `
      <h2>Furniture Library</h2>
      <p>Our collection includes:</p>
      <ul>
        <li>Modern sofas and seating</li>
        <li>Dining tables and chairs</li>
        <li>Bedroom furniture</li>
        <li>Storage solutions</li>
        <li>Decorative accessories</li>
        <li>Lighting fixtures</li>
      </ul>
      <p>All furniture models are optimized for real-time 3D visualization.</p>
    `,
  },
  colors: {
    title: "Color Palettes",
    description: "Explore curated color palettes for different design styles",
    content: `
      <h2>Color Palettes</h2>
      <p>Choose from our collection of color schemes:</p>
      <ul>
        <li><strong>Modern Minimalist:</strong> Clean whites, grays, and blacks</li>
        <li><strong>Warm & Cozy:</strong> Earthy tones and warm neutrals</li>
        <li><strong>Bold & Vibrant:</strong> Saturated colors for statement designs</li>
        <li><strong>Pastel Dreams:</strong> Soft, muted tones for calm spaces</li>
        <li><strong>Nature Inspired:</strong> Greens, blues, and natural browns</li>
      </ul>
      <p>Use the color picker in the designer to experiment with different schemes!</p>
    `,
  },
  tutorials: {
    title: "Tutorials",
    description: "Step-by-step guides to master the 3D designer",
    content: `
      <h2>Tutorials</h2>
      <p>Learn how to use our tools:</p>
      <ul>
        <li><strong>Getting Started:</strong> Basic navigation and controls</li>
        <li><strong>Creating Custom Rooms:</strong> Define dimensions and layout</li>
        <li><strong>Adding Furniture:</strong> Placing and decorating your space</li>
        <li><strong>Advanced Techniques:</strong> Lighting, materials, and rendering</li>
        <li><strong>Exporting Designs:</strong> Sharing your creations</li>
      </ul>
      <p>Video tutorials coming soon!</p>
    `,
  },
  faq: {
    title: "FAQ",
    description: "Frequently asked questions about the 3D designer",
    content: `
      <h2>Frequently Asked Questions</h2>
      <h3>Is the designer free to use?</h3>
      <p>Yes! Create unlimited designs and explore our full furniture library at no cost.</p>
      
      <h3>Can I export my designs?</h3>
      <p>Sign up for an account to save and export your designs in various formats.</p>
      
      <h3>What browsers are supported?</h3>
      <p>We support Chrome, Firefox, Safari, and Edge on desktop devices.</p>
      
      <h3>Can I use my designs commercially?</h3>
      <p>Contact us for licensing information for commercial use.</p>
      
      <h3>How do I create custom room dimensions?</h3>
      <p>Click "Create Custom Room" on the home page to define your own dimensions.</p>
    `,
  },
};

export default function ResourcesPage() {
  const { resource } = useParams();
  const resourceData = RESOURCES[resource];

  if (!resourceData) {
    return (
      <div className="min-h-[80vh] px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Resource Not Found
        </h1>
        <p className="text-gray-600">
          The resource you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-8 py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {resourceData.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">{resourceData.description}</p>
        <div
          className="prose prose-lg max-w-none text-gray-700 bg-white rounded-lg p-8 border border-gray-200"
          dangerouslySetInnerHTML={{ __html: resourceData.content }}
        />
      </div>
    </div>
  );
}
