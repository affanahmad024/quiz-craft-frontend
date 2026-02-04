import PageTransition from "./PageTransition";
import PropTypes from "prop-types";

/**
 * AnimatedPage - Simplified page wrapper with fade animation
 */
function AnimatedPage({ children, variant = "fade", className = "" }) {
  return (
    <PageTransition variant={variant} className={className}>
      {children}
    </PageTransition>
  );
}

AnimatedPage.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "slide", "fade"]),
  className: PropTypes.string,
};

export default AnimatedPage;
