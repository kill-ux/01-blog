package api;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import java.lang.annotation.*;

@Documented
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface CustomAnnotation {
    String value() default "Default";
}
/*
 * <stronng>this is the parent</strong>
 */
@CustomAnnotation("ParentClass Annotation")
class Parent {
}

/*
    aaa
 * <stronng>this is the child</strong>
 */
class Child extends Parent {
}

public class Example {
    public static void main(String[] args) {
        System.out.println(Parent.class.getAnnotation(CustomAnnotation.class)); // Prints annotation info
        System.out.println(Child.class.getAnnotation(CustomAnnotation.class));  // Also prints annotation info due to @Inherited
    }
}
